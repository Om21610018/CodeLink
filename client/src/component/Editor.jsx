import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        (editorRef.current = document.getElementById("realtimeEditor")),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          viewportMargin: Infinity,
          // Prevents the editor from resizing based on content
        }
      );
      editorRef.current.setSize("100%%", "100%");

      // Get the code from the server if available for the specific roomId
      fetch(`/editor/${roomId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code) {
            editorRef.current.setValue(data.code);
            onCodeChange(data.code);
          } else {
            editorRef.current.setValue("console.log('Hello')");
            onCodeChange("console.log('Hello')");
          }
        });

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        fetch(`/editor/${roomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
        if (origin !== "setValue") {
          // This will send to server then server will send to all the sockets using io
          socketRef.current.emit("codechange", { roomId, code });
        }
      });
    }

    init();
  }, []);

  useEffect(() => {
    // Replace socketRef with your actual socket reference
    if (socketRef.current) {
      socketRef.current.on("codechange", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("codechange");
      }
    };
  }, [socketRef.current]);

  return (
    <textarea id="realtimeEditor" className="">
      Welcome Everyone
    </textarea>
  );
};

export default Editor;
