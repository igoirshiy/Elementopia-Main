import React, { useState, useEffect, useCallback, useRef } from "react";
import { Stage, Layer, Circle, Text, Line, Group } from "react-konva";
import { Modal } from "@mui/material";
import { Sparkles, Maximize2, Minimize2, Beaker, Trash2 } from "lucide-react";
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
		rgb = "244, 63, 94"; hex = "#fb7185"; textHex = "#fda4af";
	} else if (category.includes("alkaline earth metal")) {
		rgb = "249, 115, 22"; hex = "#fb923c"; textHex = "#fdba74";
	} else if (category.includes("transition metal")) {
		rgb = "234, 179, 8"; hex = "#facc15"; textHex = "#fde047";
	} else if (category.includes("post-transition metal")) {
		rgb = "20, 184, 166"; hex = "#2dd4bf"; textHex = "#5eead4";
	} else if (category.includes("metalloid")) {
		rgb = "34, 197, 94"; hex = "#4ade80"; textHex = "#86efac";
	} else if (category.includes("nonmetal")) {
		rgb = "6, 182, 212"; hex = "#22d3ee"; textHex = "#67e8f9";
	} else if (category.includes("noble gas")) {
		rgb = "99, 102, 241"; hex = "#818cf8"; textHex = "#a5b4fc";
	} else if (category.includes("lanthanide")) {
		rgb = "14, 165, 233"; hex = "#38bdf8"; textHex = "#7dd3fc";
	} else if (category.includes("actinide")) {
		rgb = "217, 70, 239"; hex = "#e879f9"; textHex = "#f0abfc";
	}

	return {
		fill: `rgba(${rgb}, 0.15)`,
		stroke: hex,
		shadowColor: `rgba(${rgb}, 0.8)`,
		textFill: textHex
	};
};

const definitionCache = {};

const findElementData = (elementSymbol) => {
	const symbol = (elementSymbol || "").toLowerCase();

	if (periodicTableData[symbol]) {
		return periodicTableData[symbol];
	}

	for (const key in periodicTableData) {
		const element = periodicTableData[key];
		if (element.symbol && element.symbol.toLowerCase() === symbol) {
			return element;
		}
	}

	for (const key in periodicTableData) {
		const element = periodicTableData[key];
		if (element.name && element.name.toLowerCase() === symbol) {
			return element;
		}
	}

	return null;
};

const getValenceCount = (symbol) => {
	const sym = (symbol || "").toUpperCase();
	if (["H", "LI", "NA", "K"].includes(sym)) return 1;
	if (["BE", "MG", "CA"].includes(sym)) return 2;
	if (["B", "AL"].includes(sym)) return 3;
	if (["C", "SI"].includes(sym)) return 4;
	if (["N", "P"].includes(sym)) return 5;
	if (["O", "S"].includes(sym)) return 6;
	if (["F", "CL", "BR"].includes(sym)) return 7;
	if (["HE", "NE", "AR"].includes(sym)) return 8;
	return 4;
};

const isMetal = (symbol) => {
	const sym = (symbol || "").toUpperCase();
	return ["NA", "MG", "LI", "CA", "K", "FE", "ZN", "AL"].includes(sym);
};

const ChemSim = () => {
	const [atoms, setAtoms] = useState(initialAtoms);
	const [selectedElement, setSelectedElement] = useState("H");
	const [selectedElementInfo, setSelectedElementInfo] = useState(null);
	const [moleculeOutput, setMoleculeOutput] = useState("");
	const [loadingDefinition, setLoadingDefinition] = useState(false);
	const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
	const [discoveredCompoundInfo, setDiscoveredCompoundInfo] = useState(null);
	const [discoveredHistory, setDiscoveredHistory] = useState(new Set());
	const [isExpanded, setIsExpanded] = useState(false);
	const [stageScale, setStageScale] = useState(1);
	const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
	const [stageWidth, setStageWidth] = useState(760);

	const layerRef = useRef(null);
	const [animProgress, setAnimProgress] = useState(0);

	useEffect(() => {
		const updateWidth = () => {
			if (window.innerWidth < 640) {
				setStageWidth(window.innerWidth - 32);
			} else if (window.innerWidth < 1024) {
				setStageWidth(window.innerWidth - 64);
			} else {
				setStageWidth(760);
			}
		};
		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	}, []);

	useEffect(() => {
		let animId;
		let lastTime = Date.now();
		const loop = () => {
			const now = Date.now();
			const dt = (now - lastTime) / 1000;
			lastTime = now;
			setAnimProgress((prev) => (prev + dt * 0.8) % 1);

			if (layerRef.current) {
				layerRef.current.batchDraw();
			}
			animId = requestAnimationFrame(loop);
		};
		animId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animId);
	}, []);

	const navigate = useNavigate();

	useEffect(() => {
		if (selectedElement) {
			const elementData = findElementData(selectedElement);
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

	const saveDiscovery = async (compound) => {
		const user = await UserService.getCurrentUser();
		if (!user?.userId) {
			console.warn("User is not logged in to save discovery.");
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

			setDiscoveredCompoundInfo({
				name: foundCompound.NAME,
				symbol: foundCompound.Symbol,
				description: description,
				uses: foundCompound.Uses.join(", "),
				elements: foundCompound.Elements.join(", ")
			});

			if (!discoveredHistory.has(foundCompound.NAME)) {
				setDiscoveredHistory((prev) => new Set([...prev, foundCompound.NAME]));
				saveDiscovery(foundCompound);
				setShowDiscoveryModal(true);
			}
		} else {
			setMoleculeOutput("No known molecule formed.");
			setDiscoveredCompoundInfo(null);
		}
	}, [atoms, discoveredHistory]);

	useEffect(() => {
		checkMolecule();
	}, [checkMolecule]);

	const handleStageClick = (e) => {
		if (e.evt && e.evt.button === 2) {
			e.evt.preventDefault();
			return;
		}
		if (e.target === e.target.getStage()) {
			const stage = e.target.getStage();
			const pointer = stage.getPointerPosition();
			if (!pointer) return;

			const x = (pointer.x - stage.x()) / stage.scaleX();
			const y = (pointer.y - stage.y()) / stage.scaleY();

			setAtoms((prevAtoms) => [
				...prevAtoms,
				{
					id: Date.now() + Math.random(),
					x,
					y,
					element: selectedElement,
				},
			]);
		}
	};

	const handleAtomRightClick = (e, id) => {
		if (e) {
			e.cancelBubble = true;
			if (e.evt) {
				e.evt.preventDefault();
				e.evt.stopPropagation();
			}
		}
		setAtoms((prevAtoms) => prevAtoms.filter((atom) => String(atom.id) !== String(id)));
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
		const id = parseFloat(e.target.id());
		const { x, y } = e.target.position();
		setAtoms((prevAtoms) =>
			prevAtoms.map((atom) => (atom.id === id ? { ...atom, x, y } : atom))
		);
	};

	const getBonds = () => {
		let bonds = [];
		for (let i = 0; i < atoms.length; i++) {
			for (let j = i + 1; j < atoms.length; j++) {
				const dx = atoms[j].x - atoms[i].x;
				const dy = atoms[j].y - atoms[i].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance > 0 && distance < 130) {
					const radius = 24;
					const offset = radius + 2;

					const isMetalI = isMetal(atoms[i].element);
					const isMetalJ = isMetal(atoms[j].element);
					const isIonic = (isMetalI || isMetalJ) && (isMetalI !== isMetalJ);

					let fromAtom = atoms[i];
					let toAtom = atoms[j];
					if (isIonic && isMetalJ) {
						fromAtom = atoms[j];
						toAtom = atoms[i];
					}

					const bdx = toAtom.x - fromAtom.x;
					const bdy = toAtom.y - fromAtom.y;
					const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
					const nx = bdist > 0 ? bdx / bdist : 0;
					const ny = bdist > 0 ? bdy / bdist : 0;

					const startX = fromAtom.x + nx * offset;
					const startY = fromAtom.y + ny * offset;
					const endX = toAtom.x - nx * offset;
					const endY = toAtom.y - ny * offset;

					let eX, eY;
					if (isIonic) {
						eX = startX + (endX - startX) * animProgress;
						eY = startY + (endY - startY) * animProgress;
					} else {
						const midX = (startX + endX) / 2;
						const midY = (startY + endY) / 2;
						const osc = Math.sin(animProgress * Math.PI * 2) * 8;
						eX = midX + (nx || 0) * osc;
						eY = midY + (ny || 0) * osc;
					}

					bonds.push({
						startX,
						startY,
						endX,
						endY,
						isIonic,
						eX,
						eY
					});
				}
			}
		}
		return bonds;
	};

	const handleClear = () => {
		setAtoms([]);
		setMoleculeOutput("");
		setDiscoveredCompoundInfo(null);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto lg:overflow-hidden">
			{/* Responsive Header with Visual Guide & Erase Mode Toggle */}
			<div className="mb-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
				<div className="text-left">
					<div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Simulation Laboratory</div>
					<h1 className="font-pixel text-lg sm:text-xl font-bold text-white tracking-wider uppercase text-glow-magenta">
						Chemistry Sandbox
					</h1>
				</div>

				<div className="font-mono text-xs text-cyan/90 bg-cyan/10 border border-cyan/30 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
					<span>🖱️ Left-Click Stage: Add Atom</span>
					<span className="text-white/30">|</span>
					<span>🖱️ Right-Click Atom: Remove</span>
				</div>
			</div>
			<div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-5 flex-1 min-h-0 items-start overflow-y-auto lg:overflow-hidden">
				<div className="w-full lg:w-[270px] flex flex-col gap-3 shrink-0 lg:h-full overflow-y-auto custom-scrollbar">
					<button
						onClick={handleClear}
						className="rounded-xl w-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] py-2.5 font-['Montserrat',sans-serif] font-[800] text-[0.75rem] text-white shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-all uppercase tracking-wider whitespace-nowrap hover:shadow-[0_0_18px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2"
					>
						<Trash2 size={14} /> Clear Workbench
					</button>
					<div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-left flex-1">
						<h2 className="font-mono text-[10px] mb-3 text-cyan tracking-[0.2em] uppercase font-bold border-b border-border/40 pb-1.5">
							Element Properties
						</h2>
						{selectedElementInfo ? (
							<div className="font-mono text-[11px] text-muted-foreground space-y-1.5">
								<p><strong className="text-white">Name:</strong> {selectedElementInfo.name || "N/A"}</p>
								<p><strong className="text-white">Symbol:</strong> {selectedElementInfo.symbol || "N/A"}</p>
								<p><strong className="text-white">Atomic Mass:</strong> {selectedElementInfo.atomic_mass || "N/A"}</p>
								<p><strong className="text-white">Atomic Number:</strong> {selectedElementInfo.number || "N/A"}</p>
								<p><strong className="text-white">Category:</strong> {selectedElementInfo.category || "N/A"}</p>
								<p><strong className="text-white">Phase:</strong> {selectedElementInfo.phase || "N/A"}</p>
								<p><strong className="text-white">Group:</strong> {selectedElementInfo.group || "N/A"}</p>
								<p><strong className="text-white">Period:</strong> {selectedElementInfo.period || "N/A"}</p>
								<p><strong className="text-white">Density:</strong> {selectedElementInfo.density ? `${selectedElementInfo.density} g/cm³` : "N/A"}</p>
							</div>
						) : (
							<p className="font-mono text-[11px] text-muted-foreground">Select an element from the table to inspect properties.</p>
						)}
					</div>
				</div>
				<div className="w-full lg:flex-1 flex flex-col min-w-0 lg:h-full overflow-hidden">
					<div className="flex items-center justify-between gap-3 mb-2 rounded-xl border border-cyan/30 bg-slate-950/90 py-2 px-3.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md shrink-0">
						<div className="flex items-center gap-2">
							<Beaker className="size-4 text-cyan animate-pulse" />
							<div className="text-left">
								<span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">
									Active Workbench Mixture
								</span>
								<span className="font-pixel text-xs sm:text-sm font-bold text-white">
									{atoms.length === 0 ? "Empty Canvas" : (discoveredCompoundInfo ? discoveredCompoundInfo.name : `${atoms.length} Atom${atoms.length === 1 ? '' : 's'} Placed`)}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{atoms.length === 0 ? (
								<span className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
									⚪ CANVAS EMPTY
								</span>
							) : discoveredCompoundInfo ? (
								<span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-bounce">
									🟢 STABLE OCTET COMPOUND! 🎉
								</span>
							) : (
								<span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
									🔴 REACTION INCOMPLETE (Open Slots)
								</span>
							)}
						</div>
					</div>

					<div className="flex justify-center mb-2 relative shrink-0 w-full overflow-hidden">
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 border border-white/20 text-white p-1.5 rounded-lg backdrop-blur-md transition-all shadow-lg flex items-center justify-center group"
							title={isExpanded ? "Collapse Stage" : "Expand Stage"}
						>
							{isExpanded ? (
								<Minimize2 size={16} className="text-white/80 group-hover:text-white transition-colors" />
							) : (
								<Maximize2 size={16} className="text-white/80 group-hover:text-white transition-colors" />
							)}
						</button>
						<Stage
							width={stageWidth}
							height={isExpanded ? 320 : 150}
							scaleX={stageScale}
							scaleY={stageScale}
							x={stagePos.x}
							y={stagePos.y}
							onClick={handleStageClick}
							onWheel={handleWheel}
							onDragEnd={handleStageDragEnd}
							onContextMenu={(e) => e.evt.preventDefault()}
							style={{
								border: "1px solid rgba(255,255,255,0.1)",
								borderRadius: "14px",
								backgroundColor: "rgba(0,0,0,0.4)",
								cursor: "grab",
								overflow: "hidden"
							}}
						>
							<Layer ref={layerRef}>
								{getBonds().map((bond, index) => (
									<React.Fragment key={`bond-${index}`}>
										<Line
											points={[bond.startX, bond.startY, bond.endX, bond.endY]}
											stroke={bond.isIonic ? "#ec4899" : "#22d3ee"}
											strokeWidth={bond.isIonic ? 3 : 4}
											dash={bond.isIonic ? [6, 4] : undefined}
											opacity={0.85}
											shadowBlur={bond.isIonic ? 12 : 8}
											shadowColor={bond.isIonic ? "#ec4899" : "#22d3ee"}
										/>
										<Circle
											x={bond.eX}
											y={bond.eY}
											radius={bond.isIonic ? 4.5 : 4}
											fill={bond.isIonic ? "#f43f5e" : "#67e8f9"}
											shadowBlur={10}
											shadowColor={bond.isIonic ? "#f43f5e" : "#67e8f9"}
										/>
									</React.Fragment>
								))}
								{atoms.map((atom) => {
									const style = getElementStyle(atom.element);
									const valenceCount = getValenceCount(atom.element);
									const dots = [];
									for (let v = 0; v < valenceCount; v++) {
										const angle = (v / valenceCount) * Math.PI * 2;
										dots.push({
											x: 32 * Math.cos(angle),
											y: 32 * Math.sin(angle)
										});
									}

									return (
										<Group
											key={atom.id}
											id={String(atom.id)}
											x={atom.x}
											y={atom.y}
											draggable
											onDragMove={handleDragMove}
											onContextMenu={(e) => handleAtomRightClick(e, atom.id)}
										>
											{dots.map((dot, dIdx) => (
												<Circle
													key={`vdot-${atom.id}-${dIdx}`}
													x={dot.x}
													y={dot.y}
													radius={3.5}
													fill={style.stroke}
													shadowBlur={6}
													shadowColor={style.stroke}
												/>
											))}

											<Circle
												radius={24}
												fill={style.fill}
												stroke={style.stroke}
												strokeWidth={3}
												shadowBlur={15}
												shadowColor={style.shadowColor}
											/>
											<Text
												x={atom.element.length > 1 ? -11 : -6}
												y={-7}
												text={atom.element}
												fontSize={16}
												fill={style.textFill}
												fontFamily="monospace"
												fontStyle="bold"
											/>
										</Group>
									);
								})}
							</Layer>
						</Stage>
					</div>

					<div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
						<ElementTable
							selectedElement={selectedElement}
							setSelectedElement={setSelectedElement}
						/>
					</div>
				</div>

				<div className="w-full lg:w-[270px] flex flex-col gap-3 shrink-0 lg:h-full overflow-y-auto custom-scrollbar">
					<div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-left">
						<h2 className="font-mono text-[10px] mb-2 text-magenta tracking-[0.2em] uppercase font-bold border-b border-border/40 pb-1.5">
							Synthesis Result
						</h2>
						{loadingDefinition ? (
							<div className="font-mono text-xs text-magenta animate-pulse">Scanning database...</div>
						) : (
							<div className="font-mono text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
								{moleculeOutput || "No molecule formed yet."}
							</div>
						)}
					</div>

					{discoveredCompoundInfo && (
						<div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 shadow-sm text-left">
							<div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-wider mb-2">
								<Sparkles size={13} /> Discovery Record Unlocked
							</div>
							<p className="font-pixel text-xs text-white font-bold mb-0.5">{discoveredCompoundInfo.name}</p>
							<p className="font-mono text-[11px] text-cyan mb-2">Formula: {discoveredCompoundInfo.symbol}</p>
							<button
								onClick={() => setShowDiscoveryModal(true)}
								className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] uppercase tracking-wider transition-colors"
							>
								Inspect Record 📖
							</button>
						</div>
					)}
				</div>
			</div>

			<Modal
				open={showDiscoveryModal}
				onClose={() => setShowDiscoveryModal(false)}
			>
				<div
					className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 flex flex-col text-foreground"
					style={{ minHeight: 'auto', background: 'transparent' }}
				>
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