import React, { useState, useEffect, useCallback } from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";
import {
    Box,
    Typography,
    Button,
    ToggleButton,
    CircularProgress,
    Modal,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ElementTable from "./ElementTable";
import compoundElements from "../data/compound-elements.json";
import DiscoveryService from '@/features/student-discovery/services/DiscoveryService';
import UserService from '@/features/auth-user';
import periodicTableData from "../data/periodic-table-lookup.json";

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

    const checkMolecule = useCallback(async () => {
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
    }, [atoms]);

    useEffect(() => {
        checkMolecule();
    }, [checkMolecule]);

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
        <div className="mx-auto max-w-[1600px] w-full mt-4 flex justify-between gap-8 flex-wrap">
            {/* Left: Simulation */}
            <div className="flex-1 mr-5">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 text-center" style={{ textShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
                    Chemistry Sandbox
                </h1>

                <Stage
                    width={900}
                    height={300}
                    onClick={handleStageClick}
                    style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.4)" }}
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

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => setEraseMode(!eraseMode)}
                        className={`px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition ${
                            eraseMode 
                                ? "bg-destructive text-destructive-foreground shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                                : "bg-card border border-border/40 text-muted-foreground hover:bg-white/5"
                        }`}
                    >
                        Erase Mode
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold uppercase tracking-wider text-sm transition hover:bg-destructive/80"
                    >
                        Clear Workbench
                    </button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[340px] flex flex-col gap-6 mt-16">
                {/* Element Info */}
                <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                    <h2 className="font-mono text-xs mb-4 text-cyan tracking-[0.2em] uppercase">
                        ⚛️ Element Info
                    </h2>

                    {selectedElementInfo ? (
                        <div className="font-mono text-sm text-muted-foreground space-y-2">
                            <p><strong className="text-white">Name:</strong> {selectedElementInfo.name || "N/A"}</p>
                            <p><strong className="text-white">Atomic Mass:</strong> {selectedElementInfo.atomic_mass || "N/A"}</p>
                            <p><strong className="text-white">Atomic Number:</strong> {selectedElementInfo.number || "N/A"}</p>
                            <p><strong className="text-white">Category:</strong> {selectedElementInfo.category || "N/A"}</p>
                            <p><strong className="text-white">Phase:</strong> {selectedElementInfo.phase || "N/A"}</p>
                            <p><strong className="text-white">Group:</strong> {selectedElementInfo.group || "N/A"}</p>
                            <p><strong className="text-white">Period:</strong> {selectedElementInfo.period || "N/A"}</p>
                            <p><strong className="text-white">Boiling Point:</strong> {selectedElementInfo.boil ? `${selectedElementInfo.boil} K` : "N/A"}</p>
                            <p><strong className="text-white">Melting Point:</strong> {selectedElementInfo.melt ? `${selectedElementInfo.melt} K` : "N/A"}</p>
                            <p><strong className="text-white">Density:</strong> {selectedElementInfo.density ? `${selectedElementInfo.density} g/cm³` : "N/A"}</p>
                            {selectedElementInfo.discovered_by && (
                                <p><strong className="text-white">Discovered by:</strong> {selectedElementInfo.discovered_by}</p>
                            )}
                        </div>
                    ) : (
                        <p className="font-mono text-sm text-muted-foreground">Select an element to see its properties.</p>
                    )}
                </div>

                {/* Molecule Info */}
                <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-[0_0_15px_rgba(236,72,153,0.05)] overflow-y-auto max-h-[320px]">
                    <h2 className="font-mono text-xs mb-4 text-magenta tracking-[0.2em] uppercase">
                        🧪 Molecule Info
                    </h2>
                    {loadingDefinition ? (
                        <div className="font-mono text-sm text-magenta animate-pulse">Scanning database...</div>
                    ) : (
                        <div className="font-mono text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {moleculeOutput}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Discovery Modal */}
            <Modal
                open={showDiscoveryModal}
                onClose={() => setShowDiscoveryModal(false)}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[95vw] outline-none">
                    {/* Glowing Backdrop Element */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-magenta/30 to-cyan/30 rounded-[2.5rem] blur-2xl opacity-60 animate-pulse pointer-events-none" />
                    
                    {/* Main Glass Card */}
                    <div className="relative bg-[#0d0f1a]/85 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-10 text-center shadow-2xl overflow-hidden">
                        
                        {/* Decorative Top Highlight */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan via-magenta to-cyan opacity-80" />

                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-full bg-magenta/10 border border-magenta/20 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                                <Sparkles className="w-10 h-10 text-magenta" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h2 className="font-display text-4xl font-extrabold text-white mb-2 tracking-tight">
                            Synthesized!
                        </h2>
                        
                        {discoveredCompoundInfo && (
                            <div className="mt-6 mb-8 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-1 font-mono">
                                        Compound Verified
                                    </p>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-magenta to-cyan bg-clip-text text-transparent pb-1">
                                        {discoveredCompoundInfo.name}
                                    </h3>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm mt-4">
                                    <p className="text-[14px] text-white/90 leading-relaxed">
                                        {discoveredCompoundInfo.description}
                                    </p>
                                </div>

                                <div className="bg-cyan/5 border border-cyan/20 rounded-2xl p-5 text-left">
                                    <h4 className="text-[11px] font-mono text-cyan uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                                        Primary Applications
                                    </h4>
                                    <p className="text-[13px] text-cyan/90 leading-relaxed font-medium">
                                        {discoveredCompoundInfo.uses}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center mt-2">
                            <button
                                onClick={() => setShowDiscoveryModal(false)}
                                className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white font-bold uppercase tracking-wider text-[11px] transition hover:bg-white/10"
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleGoToDiscovery}
                                className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-magenta to-violet-600 text-white font-bold uppercase tracking-wider text-[11px] transition hover:scale-105 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]"
                            >
                                Log to Database
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ChemSim;