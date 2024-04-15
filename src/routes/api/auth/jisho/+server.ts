import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';
import JishoAPI, { ExampleParseResult, JishoAPIResult, JishoResult, KanjiParseResult } from 'unofficial-jisho-api';
import { toRomaji } from 'wanakana';

const jisho = new JishoAPI();

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, url }) {
	// get the session
	const session = await locals.getSession() as CustomSession;
	const accountId = session.account.id;
	const word = url.searchParams.get('word') as string;

	const resultPhrase = await jisho.searchForPhrase(word).then(result => {
		return result.data;
	}) as JishoResult[];

	const resultKanji = await jisho.searchForKanji(word).then(result => {
		return result;
	}) as KanjiParseResult;

	const resultExample = await jisho.searchForExamples(word).then(result => {
		return result;
	}) as ExampleParseResult;

	const result = buildUsefullInfo(resultPhrase, resultKanji, resultExample, word);

	return json({
		status: 200,
		body: {
			result
		}
	});
}

function buildUsefullInfo(phrase: JishoResult[], kanji: KanjiParseResult, example: ExampleParseResult, searchTerm: string) {

	let phraseData = null;
	if (phrase.length > 0) {
		const singlePhrase = phrase[0];
		phraseData = {
			word: singlePhrase.japanese[0]?.word ?? null,
			reading: singlePhrase.japanese[0]?.reading ?? null,
			romaji: toRomaji(singlePhrase.japanese[0].reading) ?? null,
			definition1: singlePhrase.senses[0]?.english_definitions[0] ?? null,
			definition2: singlePhrase.senses[0]?.english_definitions[1] ?? null,			
		}
	}

	let kanjiData = null;
	if (kanji.found == true) {
		kanjiData = {
			meaning: kanji.meaning,
			frequency: kanji.newspaperFrequencyRank,
			strokes: kanji.strokeCount,
			strokeImage: kanji.strokeOrderSvgUri,
			uri: kanji.uri,
			kunyomi: kanji.kunyomi[0] ?? null,
			onyomi: kanji.onyomi[0] ?? null,
			kunyomiExamples: {
					example: kanji.kunyomiExamples[0]?.example ?? null,
					reading: kanji.kunyomiExamples[0]?.reading ?? null,
					meaning: kanji.kunyomiExamples[0]?.meaning ?? null
			},
			onyomiExamples: {
					example: kanji.onyomiExamples[0]?.example ?? null,
					reading: kanji.onyomiExamples[0]?.reading ?? null,
					meaning: kanji.onyomiExamples[0]?.meaning ?? null
			},
		}
	}

	let exampleData = null;
	if (example.found == true) {
		const exampleDataArr: any = [];

		const phraseWord = phraseData?.word ?? '';
		const phraseReading = phraseData?.reading ?? '';
		const phraseSearchTerm = searchTerm ?? '';
		const phraseDefinition1 = phraseData?.definition1 ?? '';

		//limit the number of examples to 2
		const examples = example.results.slice(0, 2);

		examples.forEach(result => {

			const englishExample = highlightText(result.english, [phraseWord, phraseReading, phraseSearchTerm, phraseDefinition1]);
			const kanjiExample = highlightText(result.kanji, [phraseWord, phraseReading, phraseSearchTerm, phraseDefinition1]);
			const kanaExample = highlightText(result.kana, [phraseWord, phraseReading, phraseSearchTerm, phraseDefinition1]);

			const singleResult = {
				english: englishExample,
				kanji: kanjiExample,
				kana: kanaExample
			}
			exampleDataArr.push(singleResult);
		});
		
		exampleData = {examples: exampleDataArr};
	}

	return {
		searchTerm,
		phraseData,
		kanjiData,
		exampleData
	};
}

function highlightText(text:string, highlights:string[]) {
    // Remove duplicates and empty strings from highlights
    highlights = [...new Set(highlights)].filter(highlight => highlight.trim() !== '');

    // Escape special characters in highlights for use in regular expressions
    const escapedHighlights = highlights.map(highlight => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Create a regular expression pattern to match any of the highlights
    const pattern = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

    // Replace matches with highlighted versions
    const highlightedText = text.replace(pattern, '<span class="highlight-text">$1</span>');

    return `<p>${highlightedText}</p>`;
}