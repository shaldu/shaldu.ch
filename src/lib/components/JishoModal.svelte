<script lang="ts">
	import {
		Button,
		Modal,
		Accordion,
		AccordionItem,
		ExpandableTile
	} from 'carbon-components-svelte';

	type JishoData = {
		searchTerm: string;
		phraseData: {
			word: string;
			reading: string;
			romaji: string;
			definition1: string;
			definition2: string;
		};
		kanjiData: {
			meaning: string;
			frequency: string;
			strokes: string;
			strokeImage: string;
			uri: string;
			kunyomi: string;
			onyomi: string;
			kunyomiExamples: {
				example: string;
				reading: string;
				meaning: string;
			};
			onyomiExamples: {
				example: string;
				reading: string;
				meaning: string;
			};
		};
		exampleData: {
			examples: {
				english: string;
				kanji: string;
				kana: string;
			}[];
		};
	};

	export let jishoData: JishoData;
	export let addWordDefinition: (wordDefinitionString: string) => void;

	const openPhrase = () => {
		if (jishoData.phraseData && jishoData.kanjiData == null) {
			return true;
		}
	};

	function createWordDefinition() {
		let wordDefinitionString = '';
		//create a string with the important information
		//with breaklines etc

		if (jishoData.phraseData) {
			if (jishoData.phraseData.word) {
				wordDefinitionString += `Word: ${jishoData.phraseData.word}\n`;
			}
			// wordDefinitionString += `Reading: ${jishoData.phraseData.reading}\n`;
			if (jishoData.phraseData.reading) {
				wordDefinitionString += `Reading: ${jishoData.phraseData.reading}\n`;
			}
			// wordDefinitionString += `Romaji: ${jishoData.phraseData.romaji}\n`;			
			if (jishoData.phraseData.romaji) {
				wordDefinitionString += `Romaji: ${jishoData.phraseData.romaji}\n`;
			}
			// wordDefinitionString += `Definition 1: ${jishoData.phraseData.definition1}\n`;
			if (jishoData.phraseData.definition1) {
				wordDefinitionString += `Definition 1: ${jishoData.phraseData.definition1}\n`;
			}
			// wordDefinitionString += `Definition 2: ${jishoData.phraseData.definition2}\n`;
			if (jishoData.phraseData.definition2) {
				wordDefinitionString += `Definition 2: ${jishoData.phraseData.definition2}\n`;
			}
			
		}

		if (jishoData.kanjiData) {
			// wordDefinitionString += `Kanji: ${jishoData.searchTerm}\n`;
			// wordDefinitionString += `Meaning: ${jishoData.kanjiData.meaning}\n`;
			// wordDefinitionString += `Kunyomi: ${jishoData.kanjiData.kunyomi}\n`;
			// wordDefinitionString += `Onyomi: ${jishoData.kanjiData.onyomi}\n`;
			// wordDefinitionString += `Kunyomi Example: ${jishoData.kanjiData.kunyomiExamples.example}\n`;
			// wordDefinitionString += `Kunyomi Reading: ${jishoData.kanjiData.kunyomiExamples.reading}\n`;
			// wordDefinitionString += `Kunyomi Meaning: ${jishoData.kanjiData.kunyomiExamples.meaning}\n`;
			// wordDefinitionString += `Onyomi Example: ${jishoData.kanjiData.onyomiExamples.example}\n`;
			// wordDefinitionString += `Onyomi Reading: ${jishoData.kanjiData.onyomiExamples.reading}\n`;
			// wordDefinitionString += `Onyomi Meaning: ${jishoData.kanjiData.onyomiExamples.meaning}\n`;

			if (jishoData.kanjiData.meaning) {
				wordDefinitionString += `Meaning: ${jishoData.kanjiData.meaning}\n`;
			}
			if (jishoData.kanjiData.kunyomi) {
				wordDefinitionString += `Kunyomi: ${jishoData.kanjiData.kunyomi}\n`;
			}
			if (jishoData.kanjiData.onyomi) {
				wordDefinitionString += `Onyomi: ${jishoData.kanjiData.onyomi}\n`;
			}
			if (jishoData.kanjiData.kunyomiExamples.example) {
				wordDefinitionString += `Kunyomi Example: ${jishoData.kanjiData.kunyomiExamples.example}\n`;
			}
			if (jishoData.kanjiData.kunyomiExamples.reading) {
				wordDefinitionString += `Kunyomi Reading: ${jishoData.kanjiData.kunyomiExamples.reading}\n`;
			}
			if (jishoData.kanjiData.kunyomiExamples.meaning) {
				wordDefinitionString += `Kunyomi Meaning: ${jishoData.kanjiData.kunyomiExamples.meaning}\n`;
			}
			if (jishoData.kanjiData.onyomiExamples.example) {
				wordDefinitionString += `Onyomi Example: ${jishoData.kanjiData.onyomiExamples.example}\n`;
			}
			if (jishoData.kanjiData.onyomiExamples.reading) {
				wordDefinitionString += `Onyomi Reading: ${jishoData.kanjiData.onyomiExamples.reading}\n`;
			}
			if (jishoData.kanjiData.onyomiExamples.meaning) {
				wordDefinitionString += `Onyomi Meaning: ${jishoData.kanjiData.onyomiExamples.meaning}\n`;
			}

		}

		addWordDefinition(wordDefinitionString);
	}
</script>

<Modal
	open
	modalHeading="Jisho information, about: {jishoData.searchTerm}"
	primaryButtonText="Create Word"
	preventCloseOnClickOutside
	on:click:button--primary={() => {
		createWordDefinition();
	}}
>
	<Accordion align="start">
		{#if jishoData.kanjiData}
			<AccordionItem open title="Kanja Information">
				<div>
					<p>
						Meaning: {jishoData.kanjiData.meaning}<br />
						Frequency: {jishoData.kanjiData.frequency} / 2500<br />
						More information: <a href={jishoData.kanjiData.uri} target="_blank">Jisho</a>
					</p>
					<hr class="hr" />

					<div class="accordion" id="kanjiStrokeAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingStroke">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapseStroke"
									aria-expanded="false"
									aria-controls="collapseStroke"
								>
									Kanji Stroke Information
								</button>
							</h2>

							<div
								id="collapseStroke"
								class="accordion-collapse collapse"
								aria-labelledby="headingStroke"
								data-bs-parent="#kanjiStrokeAccordion"
							>
								<div class="accordion-body">
									Strokes: {jishoData.kanjiData.strokes}<br />
									<div
										style="background-color: #393265;padding:5px;margin-top:5px;width:fit-content;"
									>
										<img
											height="150"
											src={jishoData.kanjiData.strokeImage}
											alt="Kanji Stroke Order"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="accordion mt-2" id="kunyomiAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingKunyomi">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapseKunyomi"
									aria-expanded="false"
									aria-controls="collapseKunyomi"
								>
									Kanji Kunyomi Information (Japanese Reading)
								</button>
							</h2>

							<div
								id="collapseKunyomi"
								class="accordion-collapse collapse"
								aria-labelledby="headingKunyomi"
								data-bs-parent="#kunyomiAccordion"
							>
								<div class="accordion-body">
									Kunyomi: {jishoData.kanjiData.kunyomi}<br />
									<hr class="hr" />
									Example: {jishoData.kanjiData.kunyomiExamples.example}<br />
									Reading: {jishoData.kanjiData.kunyomiExamples.reading}<br />
									Meaning: {jishoData.kanjiData.kunyomiExamples.meaning}<br />
								</div>
							</div>
						</div>
					</div>

					<div class="accordion mt-2" id="onyomiAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingonyomi">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapseonyomi"
									aria-expanded="false"
									aria-controls="collapseonyomi"
								>
									Kanji Onyomi Information (Chinese Reading)
								</button>
							</h2>

							<div
								id="collapseonyomi"
								class="accordion-collapse collapse"
								aria-labelledby="headingonyomi"
								data-bs-parent="#onyomiAccordion"
							>
								<div class="accordion-body">
									Onyomi: {jishoData.kanjiData.onyomi}<br />
									<hr class="hr" />
									Example: {jishoData.kanjiData.onyomiExamples.example}<br />
									Reading: {jishoData.kanjiData.onyomiExamples.reading}<br />
									Meaning: {jishoData.kanjiData.onyomiExamples.meaning}<br />
								</div>
							</div>
						</div>
					</div>
				</div>
			</AccordionItem>
		{/if}
		{#if jishoData.phraseData}
			<AccordionItem open={openPhrase()} title="Phrase Information">
				<div>
					<p>
						{#if jishoData.phraseData.word}
							Word: {jishoData.phraseData.word}<br />
						{/if}
						{#if jishoData.phraseData.reading}
							Reading: {jishoData.phraseData.reading}<br />
						{/if}
						{#if jishoData.phraseData.romaji}
							Romaji: {jishoData.phraseData.romaji}<br />
						{/if}
					</p>
					<hr class="hr" />
					<p>
						{#if jishoData.phraseData.definition1}
							Definition 1: {jishoData.phraseData.definition1}<br />
						{/if}
						{#if jishoData.phraseData.definition2}
							Definition 2: {jishoData.phraseData.definition2}<br />
						{/if}
					</p>
				</div>
			</AccordionItem>
		{/if}
		{#if jishoData.exampleData}
			<AccordionItem title="Examples">
				<div class="accordion" id="exampleAccordion">
					{#each jishoData.exampleData.examples as example, i}
						<div class="accordion-item">
							<h2 class="accordion-header" id="heading{i}">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapse{i}"
									aria-expanded="false"
									aria-controls="collapse{i}"
								>
									Example {i + 1}
								</button>
							</h2>
							<div
								id="collapse{i}"
								class="accordion-collapse collapse"
								aria-labelledby="heading{i}"
								data-bs-parent="#exampleAccordion"
							>
								<div class="accordion-body">
									<p>{@html example.english}</p>
									<hr class="hr" />
									<p>{@html example.kanji}</p>
									<hr class="hr" />
									<p>{@html example.kana}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</AccordionItem>
		{/if}
	</Accordion>
</Modal>
