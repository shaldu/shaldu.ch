<script lang="ts">
	import { TextInput } from "carbon-components-svelte";
	import { hiraganaMap } from "./hiraganaMap";
	import { katakanaMap } from "./katakanaMap";
	import { onMount } from "svelte";
    import { isHiragana, isKatakana } from 'wanakana';

    let word: any = '';
    export let mode: "japanese" | "romanji" | "both" = "japanese";
    export let type: "hiragana" | "katakana" | "both" = "hiragana";
    let inputElm: HTMLInputElement | any | null = null;

    onMount(() => {
        if (inputElm === null) {
            return;
        }
        inputElm = inputElm.querySelector('input');
        
        inputElm.addEventListener('keydown', checkInput);

        function getRandomHiraganaWord(length = 1) {
            const hiraganaChars = Object.keys(hiraganaMap);
            let randomWord = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * hiraganaChars.length);
                randomWord += hiraganaChars[randomIndex];
            }

            return randomWord;
        }

        function getRandomKatanaWord(length = 1) {
            const katakanaChars = Object.keys(katakanaMap);
            let randomWord = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * katakanaChars.length);
                randomWord += katakanaChars[randomIndex];
            }

            return randomWord;
        }

        function getRandomRomanjiWord(length = 1) {
            const romanjiChars = Object.keys(hiraganaMap).map((key) => hiraganaMap[key] as string);
            
            let randomWord = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * romanjiChars.length);
                randomWord += romanjiChars[randomIndex];
            }
            
            return randomWord;
        }

        function getNewHiraganaWord() {
            if (mode === "japanese") {
                word = getRandomHiraganaWord();
            } else if (mode === "romanji") {
                word = getRandomRomanjiWord();
            } else if (mode === "both") {
                const random = Math.random();
                if (random > 0.5) {
                    word = getRandomHiraganaWord();
                } else {
                    word = getRandomRomanjiWord();
                }
            }
        }

        function getNewKatakanaWord() {
            if (mode === "japanese") {
                word = getRandomKatanaWord();
            } else if (mode === "romanji") {
                word = getRandomRomanjiWord();
            } else if (mode === "both") {
                const random = Math.random();
                if (random > 0.5) {
                    word = getRandomKatanaWord();
                } else {
                    word = getRandomRomanjiWord();
                }
            }
        }

        function checkInput(keyDown: KeyboardEvent) {
            if(keyDown.key === "Enter"){
                //get the value of the input
                const inputValue = inputElm.value;
                
                //get the correct mapping
                if (type === "hiragana") {

                    if (mode === "japanese" ) {

                        const correctMapping = hiraganaMap[word] as string;
                        if (correctMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    } else if (mode === "romanji") {
                        const correctMapping = getByValue(hiraganaMap, word);
                        console.log(correctMapping);
                        
                        if (correctMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    } else if (mode === "both") {
                        const hiraganaMapping = hiraganaMap[word];
                        const romanjiMapping = getByValue(hiraganaMap, word);
                        if (hiraganaMapping === inputValue || romanjiMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    }


                } else if (type === "katakana") {
                    if (mode === "japanese" ) {
                        const correctMapping = katakanaMap[word] as string;
                        if (correctMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    } else if (mode === "romanji") {
                        const correctMapping = getByValue(katakanaMap, word);
                        if (correctMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    } else if (mode === "both") {
                        const katakanaMapping = katakanaMap[word];
                        const romanjiMapping = getByValue(katakanaMap, word);
                        if (katakanaMapping === inputValue || romanjiMapping === inputValue) {
                            //correct
                            wordCorrect();
                        } else {
                            //incorrect
                            wordIncorrect();
                        }
                    }
                } else if (type == 'both') {
                    if (mode == 'japanese'){
                        if (isHiragana(word)){
                            const correctMapping = hiraganaMap[word] as string;
                            if (correctMapping === inputValue) {
                                //correct
                                wordCorrect();
                            } else {
                                //incorrect
                                wordIncorrect();
                            }
                        } else if (isKatakana(word)){
                            const correctMapping = katakanaMap[word] as string;
                            if (correctMapping === inputValue) {
                                //correct
                                wordCorrect();
                            } else {
                                //incorrect
                                wordIncorrect();
                            }
                        }
                    }
                }

            }
        }

        function newWord(){
            if(type === "hiragana"){
                getNewHiraganaWord();
            } else if(type === "katakana"){
                getNewKatakanaWord();
            } else if (type === "both") {
                const random = Math.random();
                if(random > 0.5){
                    getNewHiraganaWord();
                } else {
                    getNewKatakanaWord();
                }
            }
        }

        function wordCorrect(){

            inputElm.classList.remove('incorrect');
            inputElm.classList.add('correct');
            
            setTimeout(() => {
                inputElm.classList.remove('correct');
                inputElm.value = '';
                newWord();
            }, 200);
        }

        function getByValue(mapW: typeof hiraganaMap | typeof katakanaMap, searchValue:string) {
            for (let [key, value] of Object.entries(mapW)) {
                if (value === searchValue) {
                    return key;
                }
            }
        }

        function wordIncorrect(){
            inputElm.classList.remove('correct');
            inputElm.classList.add('incorrect');
            
            if (isHiragana(word)) {
                inputElm.value = hiraganaMap[word] as string;
            } else if (isKatakana(word)) {
                inputElm.value = katakanaMap[word] as string;
            } else {
                //get hiragana from romanji
                if (type == "hiragana" ){
                    const hiragana = getByValue(hiraganaMap, word);
                    inputElm.value = hiragana;                    

                } else if (type == "katakana"){
                    const katakana = getByValue(katakanaMap, word);
                    inputElm.value = katakana;
                }
            }
        }


        newWord();
    });

</script>


<div class="alphabetlearner-wrapper">
    <div class="card">
        <div class="header">
            <h2>{word}</h2>
        </div>
        <div class="content mt-5" bind:this={inputElm} >
           <TextInput id="input-1" labelText="" placeholder="Write here ..." />
        </div>
    </div>
</div>