import fs from "fs"
import path from "path"
import crypto from "crypto"

const sponsorData: {sponsors:Sponsor[],sections:Section[]} = JSON.parse(fs.readFileSync(path.join(process.cwd(),"./.github/SPONSORS.json")).toString())

//CONSTANTS
const CORNER_RADIUS = 10
const SPACE_MULTIPLIER = 1.2
const SVG_WIDTH = 1000

//TYPES
interface Sponsor {
    name:string,
    pictureUrl:string,
    profileUrl:string,
    sectionId:string
}
interface Section {
    name:string,
    id:string,
    pfpSize:number,
    pfpColumns:number,
    withNames:boolean
}


//FUNCTIONS
async function downloadPfpToBase64URL(url:string){
    const res = await fetch(url,{method:"GET"})
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    console.log("Downloaded picture URL:",url)
    return "data:image/png;base64,"+buffer.toString("base64")
}

function createTitle(yPos:number,name:string){
    return `<text x="${Math.round(SVG_WIDTH/2)}" y="${yPos+20}" text-anchor="middle" class="sponsor-tier-title">${name}</text>`
}

async function createPfp(yPos:number,xPos:number,size:number,sponsor:Sponsor,withNames:boolean){
    const randomId = crypto.randomBytes(8).toString("hex")
    const nameElement = (withNames) ? `<text x="${Math.round(xPos+(size/2))}" y="${yPos+size+20}" text-anchor="middle" fill="currentColor">${sponsor.name}</text>` : ""

    return (`<a href="${sponsor.profileUrl}" class="sponsor-link" target="_blank">
        <clipPath id="clipPath-${randomId}">
            <rect x="${xPos}" y="${yPos}" width="${size}" height="${size}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}"/>
        </clipPath>
        <image x="${xPos}" y="${yPos}" width="${size}" height="${size}" href="${await downloadPfpToBase64URL(sponsor.pictureUrl)}" clip-path="url(#clipPath-${randomId})"/>
        ${nameElement}
    </a>`)
}

async function generateSection(yPos:number,section:Section,sponsors:Sponsor[]){
    let sectionHtml: string = ""
    sectionHtml += createTitle(yPos,section.name)
    const nameOffset = (section.withNames) ? 20 : 0

    //divide sponsors in rows
    const groupedSponsors: Sponsor[][] = []
    let currentGroup: Sponsor[] = []
    for (const sponsor of sponsors){
        currentGroup.push(sponsor)
        if (currentGroup.length == section.pfpColumns){
            groupedSponsors.push(currentGroup)
            currentGroup = []
        }
    }
    if (currentGroup.length > 0) groupedSponsors.push(currentGroup)

    let y = 0
    for (const sponsorGroup of groupedSponsors){
        const xOffset = Math.round((SVG_WIDTH - (sponsorGroup.length * section.pfpSize * SPACE_MULTIPLIER))/2)
        let x = 0
        for (const sponsor of sponsorGroup){
            const pfpYPos = 40 + yPos + (y * ((section.pfpSize * SPACE_MULTIPLIER) + nameOffset))
            const pfpXPos = xOffset + (x * section.pfpSize * SPACE_MULTIPLIER)
            sectionHtml += await createPfp(pfpYPos,pfpXPos,section.pfpSize,sponsor,section.withNames)
            x++
        }
        y++
    }

    let sectionHeight: number = 40 + (y * ((section.pfpSize * SPACE_MULTIPLIER) + nameOffset))
    return {sectionHtml,sectionHeight}
}

async function generateSections(sections:Section[],sponsors:Sponsor[]){
    let finalHeight: number = 10
    let finalHtml: string = ""
    for (const section of sections){
        const sectionSponsors = sponsors.filter((s) => s.sectionId === section.id)
        if (sectionSponsors.length < 1) continue
        const {sectionHtml,sectionHeight} = await generateSection(finalHeight,section,sectionSponsors)
        
        finalHeight += sectionHeight
        finalHtml += sectionHtml
    }

    finalHeight += 10
    return {finalHeight,finalHtml}
}

function generateFinalHtml(sectionsHtml:string,sectionHeight:number){
    return (`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${SVG_WIDTH} ${sectionHeight}" width="${SVG_WIDTH}" height="${sectionHeight}">
        <style>
        text {
        font-weight: 300;
        font-size: 14px;
        fill: #777777;
        font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .sponsor-link {
        cursor: pointer;
        }
        .sponsor-tier-title {
        font-weight: 500;
        font-size: 20px;
        }
        </style>
        <rect x="2" y="2" width="${SVG_WIDTH-4}" height="${sectionHeight-4}" rx="20" ry="20" style="fill:transparent;stroke:#f8ba00;stroke-width:3"></rect>
        ${sectionsHtml}
    </svg>`)
}

//GENERATE SPONSORS SVG
async function main(){
    const {finalHeight,finalHtml} = await generateSections(sponsorData.sections,sponsorData.sponsors) 
    fs.writeFileSync(path.join(process.cwd(),"./.github/SPONSORS.svg"),generateFinalHtml(finalHtml,finalHeight))
}
main()