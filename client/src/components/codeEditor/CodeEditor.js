// import AceEditor from 'react-ace';
import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { CODE_SNIPPETS } from './constants';
import { Box, HStack } from "@chakra-ui/react";
import LanguageSelector from './LanguageSelector';
import Output from './Output';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState("javascript");

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
      };
    
      const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
      };
  
    // const handleChange = (newCode) => {
    //   setCode(newCode);
    // };
    // const handleRun = () => {
    //   try {
    //     // Execute the code
    //     // setOutput(executeCode(code));
    //     const result = eval(code);
    //     setOutput(String(result));
    //     console.log(output);
    //   } catch (error) {
    //     setOutput(error.toString());
    //   }

    
    // };
    return ( 
        <>
        <div className='bg-neutral-800 p-2'>
            {/* <AceEditor
                mode="javascript"
                theme="monokai"
                onChange={handleChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                width="95%"
                height="500px"
                className="m-auto mt-10 text-2xl"
                /> */}
            {/* <button className="btn btn-primary ml-10 mt-4 w-40" onClick={handleRun}>Run</button>
            <h2 className='text-white'>Output:</h2>
            <p className='text-white'>{output}</p>  */}
        <HStack spacing={4}> 
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="82vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
         </Box> 
        <Output editorRef={editorRef} language={language} />
       </HStack> 

            
        </div>
        </>
    );
}
 
export default CodeEditor;