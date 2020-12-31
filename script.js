let urlEducation = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let urlCounty = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let valueEducation = [];
let valueCounty = [];

const width = 800;
const height= 600;
const padding = 60;

let xScale 
let yScale 

let canvas = d3.select('#canvas')
canvas.attr('width',width)
canvas.attr('height',height)

let tooltip = d3.select('#tooltip')

let drawMap = () => {

    canvas.selectAll('path')
            .data(valueCounty)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class','county')
            .attr('fill', (countyDataItem)=> {
                let id = countyDataItem.id
                let county = valueEducation.find((item)=>{
                    return item.fips === id
                })
                let percentage = county.bachelorsOrHigher
                return percentage <= 15 ? 'red' : percentage <= 30 ? 'orange' : percentage <= 50 ? 'lightgreen' : 'green'
            })
            .attr('data-fips',(countyDataItem)=> {
                return countyDataItem.id
            })
            .attr('data-education', (countyDataItem)=>{
                let id = countyDataItem.id
                let county = valueEducation.find((item)=>{
                    return item.fips === id
                })
                return percentage = county.bachelorsOrHigher
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                        .style('visibility', 'visible')
                
                let id=countyDataItem.id
                let county = valueEducation.find((item)=>{
                    return item.fips === id
                })

                tooltip.text(county.fips + '-' + county['area_name'] + ', ' +
                county.state+ ':' + county.bachelorsOrHigher+'%')

                tooltip.attribute('data-education',county.bachelorsOrHigher)
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                        .style('visibility','hidden')
            })

}

d3.json(urlCounty).then(
    (data, error) => { //d3 automatically converts json string into js object
        if (error) {
            console.log(error)
        } else {
            valueCounty = topojson.feature(data,data.objects.counties).features
            console.log(valueCounty)

            d3.json(urlEducation).then(
                (data,error) => {
                    if(error){
                        console.log(error)
                    } else {
                        valueEducation=data
                        console.log(valueEducation)
                        drawMap()
                    }
                }
            )
        }
    }
)


