import React from "react";
import { Grid, Card, CardActionArea, Typography, Box, Tooltip } from "@mui/material";

const elementGroups = [
  ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,null,null,null, "He"],
  ["Li", "Be", null, null, null, null, null, null, null, null, null, null, null, null, null, "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", null, null, null, null, null, null, null, null, null, null, null, null, null, "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", "Ac", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
  [null, null, "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
  [null, null, "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
];

const ElementTable = ({ selectedElement, setSelectedElement }) => {
  return (
    <Box
      sx={{
        padding: 3,
        textAlign: "center",
        backgroundColor: "#1e1e2e",
        borderRadius: 2,
        boxShadow: 3,
        color: "white",
        width: "100%",
        maxHeight: "320px",
        overflowY: "auto",
        marginBottom: "20px",
      }}
    >
      <Grid container spacing={0.3} justifyContent="center">
        {elementGroups.map((row, rowIndex) => (
          <Grid container item key={rowIndex} spacing={0.3} justifyContent="center">
            {row.map((element, colIndex) => (
              <Grid item key={colIndex} sx={{ width: 40, height: 40 }}>
                {element ? (
                  <Tooltip title={`Click to select ${element}`} arrow>
                    <Card
                      sx={{
                        backgroundColor: selectedElement === element ? "#4caf50" : "#333",
                        color: "white",
                        textAlign: "center",
                        border: selectedElement === element ? "2px solid yellow" : "1px solid #555",
                        borderRadius: 1,
                        transition: "0.3s",
                        width: "100%",
                        height: "100%",
                        "&:hover": {
                          backgroundColor: "#666",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <CardActionArea onClick={() => setSelectedElement(element)}>
                        <Typography
                          variant="h6"
                          sx={{
                            padding: 1,
                            fontWeight: "bold",
                            fontSize: ".7rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {element}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Tooltip>
                ) : (
                  <Box sx={{ width: "100%", height: "100%" }} />
                )}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ElementTable;
