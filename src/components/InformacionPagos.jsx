import { useState, useEffect } from "react";

const InformacionPagos = () => {
    const [fileContent, setFileContent] = useState("");

    useEffect(() => {
      const fetchFile = async () => {
        try {
          const response = await fetch(
            "https://drive.google.com/file/d/1pXAh0NpyB4pxDBRvX-P_K_AXo5v8f2y_/view?usp=sharing"
          );
          const text = await response.text();
          setFileContent(text);
        } catch (error) {
          console.error("Error fetching the file:", error);
        }
      };
  
      fetchFile();
    }, []);
  
    return (
      <div>
        <h1>Contenido del Archivo TXT</h1>
        <pre>{fileContent}</pre>
      </div>
    );
}

export default InformacionPagos