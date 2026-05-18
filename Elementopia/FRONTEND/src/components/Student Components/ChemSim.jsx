import React, { useState, useEffect } from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";
import {
    Box,
    Typography,
    Button,
    ToggleButton,
    CircularProgress,
    Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ElementTable from "./ElementTable";
import compoundElements from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";
import periodicTableData from "./periodic-table-lookup.json";

const initialAtoms = [];

const getElementColor = (element) => {
    const colors = {
        H: "#f44336",
        O: "#2196f3",
        C: "#4caf50",
        N: "#9c27b0",
        Na: "#ff9800",
        Cl: "#00bcd4",
        K: "#e91e63",
        Ca: "#8bc34a",
        Mg: "#3f51b5",
        Fe: "#795548",
    };
    return colors[element] || "#ccc";
};

const definitionCache = {};

// Helper function to find element data
const findElementData = (elementSymbol) => {
    const symbol = elementSymbol.toLowerCase();
    
    // Method 1: Direct access by lowercase symbol (hydrogen, oxygen, etc.)
    if (periodicTableData[symbol]) {
        return periodicTableData[symbol];
    }
    
    // Method 2: Search through all entries to find by symbol
    for (const key in periodicTableData) {
        const element = periodicTableData[key];
        if (element.symbol && element.symbol.toLowerCase() === symbol) {
            return element;
        }
    }
    
    // Method 3: Search by name
    for (const key in periodicTableData) {
        const element = periodicTableData[key];
        if (element.name && element.name.toLowerCase() === symbol) {
            return element;
        }
    }
    
    console.warn(`No data found for element: ${elementSymbol}`);
    return null;
};

const ChemSim = () => {
    const [atoms, setAtoms] = useState(initialAtoms);
    const [selectedElement, setSelectedElement] = useState("H");
    const [selectedElementInfo, setSelectedElementInfo] = useState(null);
    const [moleculeOutput, setMoleculeOutput] = useState("");
    const [eraseMode, setEraseMode] = useState(false);
    const [loadingDefinition, setLoadingDefinition] = useState(false);
    const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
    const [discoveredCompoundInfo, setDiscoveredCompoundInfo] = useState(null);

    const navigate = useNavigate();

    // 🔹 Update element info when user selects a new element
    useEffect(() => {
        console.log("Selected element changed:", selectedElement);
        console.log("Full periodic table data:", periodicTableData);
        
        if (selectedElement) {
            const elementData = findElementData(selectedElement);
            console.log("Found element data:", elementData);
            setSelectedElementInfo(elementData);
        }
    }, [selectedElement]);

    useEffect(() => {
        checkMolecule();
    }, [atoms]);

    const fetchDefinition = async (word) => {
        if (definitionCache[word]) return definitionCache[word];

        const apiKey = "76814e25-29c5-44de-983b-b978ece36d95";
        const url = `https://www.dictionaryapi.com/api/v3/references/medical/json/${word}?key=${apiKey}`;
        try {
            setLoadingDefinition(true);
            const response = await fetch(url);
            const data = await response.json();
            setLoadingDefinition(false);

            if (Array.isArray(data) && data.length > 0 && data[0].shortdef) {
                const definition = data[0].shortdef.slice(0, 2).join("; ");
                definitionCache[word] = definition;
                return definition;
            }
            return null;
        } catch (error) {
            console.error("Error fetching definition:", error);
            setLoadingDefinition(false);
            return null;
        }
    };

    const checkMolecule = async () => {
        const currentElements = atoms.map((atom) => atom.element);
        const foundCompound = compoundElements.find((compound) => {
            const compoundElementsSorted = [...compound.Elements].sort();
            const currentElementsSorted = [...currentElements].sort();
            return (
                JSON.stringify(compoundElementsSorted) ===
                JSON.stringify(currentElementsSorted)
            );
        });

        if (foundCompound) {
            let description = foundCompound.Description;

            const fetchedDefinition = await fetchDefinition(foundCompound.NAME);
            if (fetchedDefinition) {
                description = fetchedDefinition;
            }

            setMoleculeOutput(
                `NAME: ${foundCompound.NAME}\n` +
                `Symbol: ${foundCompound.Symbol}\n` +
                `Description: ${description}\n` +
                `Elements: ${foundCompound.Elements.join(", ")}\n` +
                `Uses: ${foundCompound.Uses.join(", ")}`
            );

            saveDiscovery(foundCompound);

            setDiscoveredCompoundInfo({
                name: foundCompound.NAME,
                description: description,
                uses: foundCompound.Uses.join(", "),
            });
            setShowDiscoveryModal(true);
        } else {
            setMoleculeOutput("No known molecule formed.");
            setDiscoveredCompoundInfo(null);
        }
    };

    const saveDiscovery = async (compound) => {
        const user = await UserService.getCurrentUser();
        if (!user?.userId) {
            alert("User is not logged in. Please log in first.");
            return;
        }

        const userId = user.userId;
        const formattedDate = new Date().toISOString().split("T")[0];

        try {
            await DiscoveryService.createDiscovery(userId, {
                name: compound.NAME,
                dateDiscovered: formattedDate,
            });
        } catch (error) {
            console.error("Error saving discovery:", error);
            alert("An error occurred while saving your discovery.");
        }
    };

    const handleStageClick = (e) => {
        if (!eraseMode) {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const { x, y } = pointer;

            setAtoms((prevAtoms) => [
                ...prevAtoms,
                {
                    id: prevAtoms.length + 1,
                    x,
                    y,
                    element: selectedElement,
                },
            ]);
        }
    };

    const handleDragMove = (e) => {
        const id = parseInt(e.target.id());
        const { x, y } = e.target.position();
        setAtoms((prevAtoms) =>
            prevAtoms.map((atom) => (atom.id === id ? { ...atom, x, y } : atom))
        );
    };

    const handleAtomClick = (id) => {
        if (eraseMode) {
            setAtoms(atoms.filter((atom) => atom.id !== id));
        }
    };

    const getBonds = () => {
        let bonds = [];
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const dx = atoms[i].x - atoms[j].x;
                const dy = atoms[i].y - atoms[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    bonds.push({ start: atoms[i], end: atoms[j] });
                }
            }
        }
        return bonds;
    };

    const handleClear = () => {
        setAtoms([]);
        setMoleculeOutput("");
    };

    const handleGoToDiscovery = () => {
        navigate("/student/discovery");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#0a0a0f",
                height: "100%",
                width: "100%",
                padding: 2,
                marginTop: "30px",
                flexWrap: "wrap",
            }}
        >
            {/* Left: Simulation */}
            <Box sx={{ flex: 1, marginRight: "20px" }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: "#ffcc00",
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: "2px 2px 8px #ffcc00",
                        marginBottom: "20px",
                    }}
                >
                    Chemistry Simulation
                </Typography>

                <Stage
                    width={900}
                    height={300}
                    onClick={handleStageClick}
                    style={{ border: "2px solid #ffcc00", borderRadius: "10px" }}
                >
                    <Layer>
                        {getBonds().map((bond, index) => (
                            <Line
                                key={index}
                                points={[bond.start.x, bond.start.y, bond.end.x, bond.end.y]}
                                stroke="#ffcc00"
                                strokeWidth={4}
                            />
                        ))}
                        {atoms.map((atom) => (
                            <React.Fragment key={atom.id}>
                                <Circle
                                    id={String(atom.id)}
                                    x={atom.x}
                                    y={atom.y}
                                    radius={24}
                                    fill={getElementColor(atom.element)}
                                    draggable
                                    onDragMove={handleDragMove}
                                    onClick={() => handleAtomClick(atom.id)}
                                    stroke="#ffffff"
                                    strokeWidth={3}
                                    shadowBlur={10}
                                    shadowColor="#ffcc00"
                                />
                                <Text
                                    x={atom.x - 6}
                                    y={atom.y - 6}
                                    text={atom.element}
                                    fontSize={18}
                                    fill="black"
                                    fontStyle="bold"
                                />
                            </React.Fragment>
                        ))}
                    </Layer>
                </Stage>

                <ElementTable
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                />

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <ToggleButton
                        value="eraseMode"
                        selected={eraseMode}
                        onChange={() => setEraseMode(!eraseMode)}
                        sx={{
                            backgroundColor: eraseMode ? "red" : "#444",
                            color: "white !important",
                            "&.Mui-selected": { backgroundColor: "red" },
                            "&:hover": { backgroundColor: eraseMode ? "#ff3333" : "#666" },
                        }}
                    >
                        Erase
                    </ToggleButton>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClear}
                        sx={{
                            backgroundColor: "#ff3333",
                            "&:hover": { backgroundColor: "#cc0000" },
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>

            {/* Right Sidebar */}
            <Box
                sx={{
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 8,
                    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                }}
            >
                {/* Element Info */}
                <Box
                    sx={{
                        padding: 2,
                        background: "linear-gradient(145deg, #101020, #181830)",
                        borderRadius: "12px",
                        color: "#e0e0e0",
                        border: "1px solid #00bcd4",
                        boxShadow: "0 0 10px #00bcd4aa",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#00bcd4",
                            marginBottom: 1,
                            fontWeight: "bold",
                            textShadow: "0 0 5px #00bcd4",
                        }}
                    >
                        ⚛️ Element Info
                    </Typography>

                    {selectedElementInfo ? (
                        <Box sx={{ fontSize: "13.5px", lineHeight: 1.6 }}>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Name:</strong> {selectedElementInfo.name || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Atomic Mass:</strong> {selectedElementInfo.atomic_mass || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Atomic Number:</strong> {selectedElementInfo.number || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Category:</strong> {selectedElementInfo.category || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Phase:</strong> {selectedElementInfo.phase || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Group:</strong> {selectedElementInfo.group || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Period:</strong> {selectedElementInfo.period || "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Boiling Point:</strong> {selectedElementInfo.boil ? `${selectedElementInfo.boil} K` : "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Melting Point:</strong> {selectedElementInfo.melt ? `${selectedElementInfo.melt} K` : "N/A"}
                            </Typography>
                            <Typography sx={{ marginBottom: 0.5 }}>
                                <strong>Density:</strong> {selectedElementInfo.density ? `${selectedElementInfo.density} g/cm³` : "N/A"}
                            </Typography>
                            {selectedElementInfo.discovered_by && (
                                <Typography sx={{ marginBottom: 0.5 }}>
                                    <strong>Discovered by:</strong> {selectedElementInfo.discovered_by}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography sx={{ color: "#999" }}>
                            Select an element to see its properties.
                        </Typography>
                    )}
                </Box>

                {/* Molecule Info */}
                <Box
                    sx={{
                        padding: 2,
                        background: "linear-gradient(145deg, #1c1c2c, #222244)",
                        borderRadius: "12px",
                        color: "#e0e0e0",
                        whiteSpace: "pre-line",
                        border: "1px solid #ffcc00",
                        overflowY: "auto",
                        maxHeight: "320px",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        boxShadow: "0 0 10px #ffcc00aa",
                        transition: "all 0.3s ease-in-out",
                        scrollbarColor: "#ffcc00 #1c1c2e",
                        scrollbarWidth: "thin",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#ffcc00",
                            marginBottom: 1,
                            fontWeight: "bold",
                            fontSize: "16px",
                            textShadow: "0 0 5px #ffcc00",
                        }}
                    >
                        🧪 Molecule Info
                    </Typography>
                    {loadingDefinition ? (
                        <CircularProgress size={24} sx={{ color: "#ffcc00" }} />
                    ) : (
                        <Typography
                            component="div"
                            sx={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "13.5px",
                                color: "#d0d0ff",
                                lineHeight: 1.7,
                            }}
                        >
                            {moleculeOutput}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Discovery Modal */}
            <Modal
                open={showDiscoveryModal}
                onClose={() => setShowDiscoveryModal(false)}
                aria-labelledby="discovery-modal-title"
                aria-describedby="discovery-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "#222",
                        border: "2px solid #ffcc00",
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        id="discovery-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ color: "#ffcc00", marginBottom: 2 }}
                    >
                        🌟 Compound Discovered!
                    </Typography>
                    {discoveredCompoundInfo && (
                        <Box>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                You discovered:{" "}
                                <strong style={{ color: "#aaffaa" }}>
                                    {discoveredCompoundInfo.name}
                                </strong>
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                Description: {discoveredCompoundInfo.description}
                            </Typography>
                            <Typography variant="body2">
                                Uses: {discoveredCompoundInfo.uses}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleGoToDiscovery}
                            sx={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                "&:hover": { backgroundColor: "#388E3C" },
                            }}
                        >
                            Go to Discoveries
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ChemSim;