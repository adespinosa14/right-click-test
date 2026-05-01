## Writeup - My Approach

I wanted to showcase a variety of my skills, so I built two implementations: a CLI tool in Python and a simple full-stack web application in React. Both solve the same core problem giving a technician a fast, structured estimate on-site, but in two different delivery formats.

### CLI - Python

I first approached this problem by printing each data component to the screen so I could understand how the three files related to each other before writing any estimation logic.

I found quickly that there were some inconsistencies in the data that needed to be handled. In `customers.json`, customer 5 was missing a phone number, and customer 8 used a different key name `"property_type"` instead of `"propertyType"` like the rest. Since these were minor differences, I added fallback checks rather than modifying the raw data.

For equipment, I had to map each customer's `systemType` string (e.g. `"Central AC + Gas Furnace"`) to the matching category names in `equipment.json`. I wrote a parser that splits on `" + "` and `" - "` delimiters and matches each token to a known category. From there, I bucketed all equipment by category, sorted each bucket by cost, and picked three items: the cheapest, the middle, and the most expensive, to represent Budget, Mid, and Premium tiers. I chose price as for tiering because it's the most practical way to give a customer options without knowing compatibility details, equipment sizing, or brand preferences upfront.

For labor, the `labor_rates.json` file has many job types: diagnostic, repair, install, maintenance, and ductwork, and I couldn't reliably guess from a customer record alone which one applies to a given visit. I just used installation labor since the README specifically calls out full system replacement quotes as the most time-consuming estimate a technician has to produce. Within installation, I selected the level based on `propertyType`: residential, commercial, or mini-split. The estimated hours in the data are sorted from min-max, so I averaged them to produce a single labor cost figure.

Finally, I added a customer selection screen where a numbered list prints to the terminal, the technician picks a number, and the tool displays the tiered estimate for that customer. I implemented both type and bounds checking on the input.

### Full Stack - React

The estimation logic mirrors the Python implementation exactly, the same category parser, the same bucketing approach, and the same labor selection rules just translated into TypeScript. I designed the frontend architecture and core components, and used Claude Code to assist with frontend cleanup. I wanted to demonstrate that I can build full-stack applications and that I'm comfortable using current AI tools as part of a development workflow. Before committing, I verified that the logic, UI, and data all worked cohesively.

### With More Time

The biggest limitation in this implementation is that the tool assumes every visit is a full installation. In reality, a technician might be there for a diagnostic, a minor repair, or routine maintenance, each with a very different labor cost. With more time, I would add a job type selection step so the technician can specify why they're on-site, and the estimate would adjust accordingly.

I also never used `squareFootage` from the customer record, even though it's directly relevant to equipment sizing, HVAC systems are rated for specific square footage ranges, and a more accurate tool would filter equipment to only show compatible options rather than everything in the catalog.

On the cost side, presenting labor as a single averaged number is a simplification. Showing a range (e.g. `$600 – $1,200`) based on the actual min/max hours in the data would be more honest for a field estimate.

For the frontend specifically, I'd like to add a map view showing where each customer is located relative to the technician's current position, making it easier to prioritize calls and plan routes.
