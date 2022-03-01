import fs = require('fs');
import { ExitStatus } from 'typescript';

type gameSetting = {
	Lplaces: number,
	Ctimes: number,
	Ngroups: number,
	groupSizes: number[]
};

// this is assuming valid input
let parseInput = (filename: string): gameSetting => {
	let { sscanf } = require('nodejs-scanf');
	let content = fs.readFileSync(filename, 'utf8');
	let lines = content.split('\n');
	let Lplaces = 0;
	let Ctimes = 0;
	let Ngroups = 0;
	let groupSizes = [];
	sscanf(lines[0], '%d %d %d', function (l, c, n) {
		Lplaces = l;
		Ctimes = c;
		Ngroups = n;
	});
	// remove first line
	lines.shift();
	// parse the rest (could use a map)
	for (let i = 0; i < Ngroups; i++) {
		sscanf(lines[i], '%d', function (size) {
			groupSizes.push(size);
		});
	}

	return { Lplaces, Ctimes, Ngroups, groupSizes };
}

let runGame = (settings: gameSetting) => {
	let earned = 0;
	let queueIdx = 0;
	for (let i = 0; i < settings.Ctimes; i++) {
		let personsLoaded = 0;

		// load the groups into the rollercoaster
		for (let j = 0; j < settings.Ngroups; j++) {
			const idx = (queueIdx + j) % settings.Ngroups;
			if (personsLoaded + settings.groupSizes[idx] > settings.Lplaces) {
				// can't load more, start the rollercoaster and store queue index
				queueIdx = idx
				break;
			} else {
				personsLoaded += settings.groupSizes[idx];
			}
		}

		// cumulate earnings
		earned += personsLoaded;
	}
	return earned
}

let samples = {
	'1_simple_case': 7,
	'2_1000_groups_of_few_people': 3935,
	'3_the_same_groups_go_on_the_ride_several_times_during_the_day': 15,
	'4_all_the_people_get_on_the_roller_coaster_at_least_once': 15000,
	'5_high_earnings_during_the_day': 4999975000,
	'6_works_with_a_large_dataset': 89744892565569,
	'7_hard': 8974489271113753,
	'8_harder': 89744892714152289,
}

// run each samples
for (const [filename, expectedResult] of Object.entries(samples)) {
	let settings = parseInput('./samples/' + filename + '.txt');
	let result = runGame(settings);
	//console.debug(`${filename}: ${JSON.stringify(settings)} => ${results}`);
	if (result != expectedResult) {
		console.error(`${filename}: ${JSON.stringify(settings)} => ${result} != ${expectedResult}`);
	} else {
		console.log(`Test ${filename} ok => ${result}`);

	}
	//console.debug(`${filename}: ${JSON.stringify(settings)} => ${results}`);
}