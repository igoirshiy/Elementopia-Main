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
import { Sparkles, Maximize2, Minimize2, Beaker } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ElementTable from "./ElementTable";
import compoundElements from "../data/compound-elements.json";
import DiscoveryService from '@/features/student-discovery/services/DiscoveryService';
import UserService from '@/features/auth-user';
import periodicTableData from "../data/periodic-table-lookup.json";

const initialAtoms = [];

const getElementStyle = (elementSymbol) => {
    const elementData = findElementData(elementSymbol);
    const category = elementData ? elementData.category : "";

    let rgb = "255, 255, 255"; 
    let hex = "#ffffff";
    let textHex = "#ffffff";

    if (!category) {
        rgb = "255, 255, 255"; hex = "#ffffff"; textHex = "#ffffff";
    } else if (category.includes("alkali metal")) {
        rgb = "244, 63, 94"; hex = "#fb7185"; textHex = "#fda4af"; // rose
    } else if (category.includes("alkaline earth metal")) {
        rgb = "249, 115, 22"; hex = "#fb923c"; textHex = "#fdba74"; // orange
    } else if (category.includes("transition metal")) {
        rgb = "234, 179, 8"; hex = "#facc15"; textHex = "#fde047"; // yellow
    } else if (category.includes("post-transition metal")) {
        rgb = "20, 184, 166"; hex = "#2dd4bf"; textHex = "#5eead4"; // teal
    } else if (category.includes("metalloid")) {
        rgb = "34, 197, 94"; hex = "#4ade80"; textHex = "#86efac"; // green
    } else if (category.includes("nonmetal")) {
        rgb = "6, 182, 212"; hex = "#22d3ee"; textHex = "#67e8f9"; // cyan
    } else if (category.includes("noble gas")) {
        rgb = "99, 102, 241"; hex = "#818cf8"; textHex = "#a5b4fc"; // indigo
    } else if (category.includes("lanthanide")) {
        rgb = "14, 165, 233"; hex = "#38bdf8"; textHex = "#7dd3fc"; // sky
    } else if (category.includes("actinide")) {
        rgb = "217, 70, 239"; hex = "#e879f9"; textHex = "#f0abfc"; // fuchsia
    }

    return {
        fill: `rgba(${rgb}, 0.15)`,
        stroke: hex,
        shadowColor: `rgba(${rgb}, 0.8)`,
        textFill: textHex
    };
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

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
                symbol: foundCompound.Symbol,
                description: description,
                uses: foundCompound.Uses.join(", "),
                elements: foundCompound.Elements.join(", ")
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
        if (!eraseMode && e.target === e.target.getStage()) {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            
            // Map absolute pointer to relative stage coordinates
            const x = (pointer.x - stage.x()) / stage.scaleX();
            const y = (pointer.y - stage.y()) / stage.scaleY();

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

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        
        // Limit zoom scale
        if (newScale < 0.2 || newScale > 5) return;

        setStageScale(newScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    const handleStageDragEnd = (e) => {
        if (e.target === e.target.getStage()) {
            setStagePos({ x: e.target.x(), y: e.target.y() });
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
                const dx = atoms[j].x - atoms[i].x;
                const dy = atoms[j].y - atoms[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0 && distance < 100) {
                    const radius = 24;
                    const gap = 2; // small gap so the line doesn't overlap the border
                    const offset = radius + gap;
                    
                    if (distance > offset * 2) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        bonds.push({ 
                            startX: atoms[i].x + nx * offset, 
                            startY: atoms[i].y + ny * offset,
                            endX: atoms[j].x - nx * offset,
                            endY: atoms[j].y - ny * offset
                        });
                    }
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
        <div className="w-full">
            <div className="mb-6 text-left">
                <div className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Simulation</div>
                <h1 className="font-pixel text-xl sm:text-2xl font-bold text-white tracking-wider uppercase text-glow-magenta">
                    Chemistry Sandbox
                </h1>
            </div>
            <div className="w-full flex justify-between gap-8 flex-wrap lg:flex-nowrap">
                {/* Left: Simulation */}
                <div className="flex-1 lg:mr-5 flex flex-col">

                <div className="flex justify-center mb-4 relative">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 border border-white/20 text-white p-2 rounded-lg backdrop-blur-md transition-all shadow-lg flex items-center justify-center group"
                        title={isExpanded ? "Collapse Stage" : "Expand Stage"}
                    >
                        {isExpanded ? (
                            <Minimize2 size={18} className="text-white/80 group-hover:text-white transition-colors" />
                        ) : (
                            <Maximize2 size={18} className="text-white/80 group-hover:text-white transition-colors" />
                        )}
                    </button>
                    <Stage
                        width={900}
                        height={isExpanded ? 500 : 160}
                        scaleX={stageScale}
                        scaleY={stageScale}
                        x={stagePos.x}
                        y={stagePos.y}
                        onClick={handleStageClick}
                        onWheel={handleWheel}
                        onDragEnd={handleStageDragEnd}
                        draggable={!eraseMode}
                        style={{ 
                            border: "1px solid rgba(255,255,255,0.1)", 
                            borderRadius: "16px", 
                            backgroundColor: "rgba(0,0,0,0.4)", 
                            cursor: eraseMode ? "crosshair" : "grab",
                            overflow: "hidden"
                        }}
                    >
                    <Layer>
                        {getBonds().map((bond, index) => (
                            <Line
                                key={index}
                                points={[bond.startX, bond.startY, bond.endX, bond.endY]}
                                stroke="#facc15"
                                strokeWidth={3}
                                opacity={0.8}
                                shadowBlur={8}
                                shadowColor="#facc15"
                            />
                        ))}
                        {atoms.map((atom) => {
                            const style = getElementStyle(atom.element);
                            return (
                                <React.Fragment key={atom.id}>
                                    <Circle
                                        id={String(atom.id)}
                                        x={atom.x}
                                        y={atom.y}
                                        radius={24}
                                        fill={style.fill}
                                        draggable
                                        onDragMove={handleDragMove}
                                        onClick={() => handleAtomClick(atom.id)}
                                        stroke={style.stroke}
                                        strokeWidth={3}
                                        shadowBlur={15}
                                        shadowColor={style.shadowColor}
                                    />
                                    <Text
                                        x={atom.x - (atom.element.length > 1 ? 11 : 6)}
                                        y={atom.y - 7}
                                        text={atom.element}
                                        fontSize={16}
                                        fill={style.textFill}
                                        fontFamily="monospace"
                                        fontStyle="bold"
                                    />
                                </React.Fragment>
                            );
                        })}
                    </Layer>
                    </Stage>
                </div>

                <ElementTable
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                />
            </div>

            {/* Right Sidebar */}
            <div className="w-[340px] flex flex-col gap-4">
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pb-2">
                    <button
                        onClick={() => setEraseMode(!eraseMode)}
                        className={`rounded-full w-full py-3.5 font-['Montserrat',sans-serif] font-[800] text-[0.8rem] uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 ${
                            eraseMode 
                                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]" 
                                : "bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        }`}
                    >
                        Erase Mode
                    </button>
                    <button
                        onClick={handleClear}
                        className="rounded-full w-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] py-3.5 font-['Montserrat',sans-serif] font-[800] text-[0.8rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider whitespace-nowrap"
                    >
                        Clear Workbench
                    </button>
                </div>

                {/* Element Info */}
                <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                    <h2 className="font-mono text-xs mb-3 text-cyan tracking-[0.2em] uppercase">
                        Element Info
                    </h2>

                    {selectedElementInfo ? (
                        <div className="font-mono text-xs text-muted-foreground space-y-1.5">
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
                        <p className="font-mono text-xs text-muted-foreground">Select an element to see its properties.</p>
                    )}
                </div>

                {/* Molecule Info */}
                <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-[0_0_15px_rgba(236,72,153,0.05)] overflow-y-auto max-h-[280px]">
                    <h2 className="font-mono text-xs mb-3 text-magenta tracking-[0.2em] uppercase">
                        Molecule Info
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

            </div>

            {/* Premium Discovery Modal */}
            <Modal
                open={showDiscoveryModal}
                onClose={() => setShowDiscoveryModal(false)}
            >
            <div 
                className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 flex flex-col text-foreground"
                style={{ minHeight: 'auto', background: 'transparent' }}
            >
                {/* Main Card */}
                <div className="relative bg-[#0a0c14] border border-border rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col max-h-full">

                    <div className="flex-1 pr-2 text-left">
                        <div className="mb-6 inline-flex rounded-xl bg-gradient-cyan glow-cyan px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary-foreground">
                            Laboratory Record
                        </div>

                        <h2 className="font-pixel text-2xl font-bold sm:text-4xl text-glow-magenta mb-2">
                            {discoveredCompoundInfo?.name}
                        </h2>
                        
                        <p className="mt-2 font-mono text-sm text-cyan mb-8">
                            Formula: {discoveredCompoundInfo?.symbol}
                        </p>

                        {discoveredCompoundInfo && (
                            <div className="space-y-6">
                                <div className="text-sm text-muted-foreground/80 leading-relaxed overflow-y-auto max-h-[160px] custom-scrollbar">
                                    {discoveredCompoundInfo.description}
                                </div>

                                <div className="border-t border-border pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                                                Primary Applications
                                            </h4>
                                            <p className="text-sm font-bold text-white/90">
                                                {discoveredCompoundInfo.uses}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                                                Elemental Composition
                                            </h4>
                                            <p className="text-sm font-bold text-cyan">
                                                {discoveredCompoundInfo.elements}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6 shrink-0">
                            <div className="font-mono text-xs text-muted-foreground">
                                Synthesized successfully.
                            </div>
                            <button
                                onClick={() => setShowDiscoveryModal(false)}
                                className="rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2.5 font-['Montserrat',sans-serif] font-[800] text-[0.85rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider whitespace-nowrap"
                            >
                                Close Record
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ChemSim;