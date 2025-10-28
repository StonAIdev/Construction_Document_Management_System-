import React, { createContext } from "react";

export const TreeContext = createContext();

// export const TreeContext = createContext();

// export function TreeProvider({ children }) {
//   const [tree, setTree] = React.useState([]);

//   return (
//     <TreeContext.Provider value={{ tree, setTree }}>
//       {children}
//     </TreeContext.Provider>
//   );
// }
