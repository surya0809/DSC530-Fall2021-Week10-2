function scatter_plot(X, Y, markersize,
    ColorData,
    axis_key,
    title = "",
    xLabel = "",
    yLabel = "",
    margin = 100) {
    // console.log(ColorData);

    function data_axis_pad(data, pad = .05) {
        return [data[0] - pad * data[0], data[1] + pad * data[1]]
    }

    let xScale = d3.scaleLinear().domain(data_axis_pad(d3.extent(X))).range([0 + margin, 1000 - margin])
    let yScale = d3.scaleLinear().domain(data_axis_pad(d3.extent(Y))).range([1000 - margin, 0 + margin])
    let radiusScale = d3.scaleLinear().domain(data_axis_pad(d3.extent(markersize))).range([3, 12])
    let colors = ['seagreen', 'skyblue', 'orangered', 'brown'];

    let islands = ["Biscoe", "Dream", "Torgersen", "N/A"];
    let colorScale = d3.scaleOrdinal().domain(d3.extent(ColorData)).range(colors)
    let axis = d3.select(`#${axis_key}`);

    const tooltip = d3.select("#tooltip");


    axis.append("g")
        .append('rect')
        .attr("class", "fig")
        .attr("width", "100%")
        .attr("height", "100%")

    axis.selectAll('.markers')
        .data(X)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            return `translate(${xScale(X[i])}, ${yScale(Y[i])})`
        })
        .append('circle').attr("r", function (d, i) {
            return radiusScale(markersize[i])
        })
        .style("fill", function (d, i) {
            // return colorScale(ColorData[i])
            // console.log(d, i);
            return colors[ColorData[i]];
        })
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .on("mouseenter", (m, d, i) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
            tooltip.html(() => {
                    return `
                    <p class="card-title">Culmen Length: ${X[i]}</p>
                    <p class="card-title">Culmen Depth: ${Y[i]}</p>
                    <p class="card-title">Flipper Length: ${markersize[i]}</p>
                    `
                })
                .style("left", m.clientX + "px")
                .style("top", m.clientY + "px");
        })
        .on("mousemove", (m, d) => {
            tooltip.style("opacity", .9)
                .style("z-index", "9999")
        })
        .on("mouseout", (m, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0)
                .style("z-index", "-999")
        });
    // // x and y Axis function
    // let x_axis = d3.axisBottom(xScale)
    // let y_axis = d3.axisLeft(yScale)
    //X Axis
    let xAxis = axis.append("g").attr("class", "axis")
        .attr("transform", `translate(${0},${1000-margin})`)
        .call(d3.axisBottom(xScale))
    // Y Axis
    let yAxis = axis.append("g").attr("class", "axis")
        .attr("transform", `translate(${margin},${0})`)
        .call(d3.axisLeft(yScale))
    // Labels
    axis.append("g").attr("class", "label")
        .attr("transform", `translate(${500},${1000-10})`)
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(xLabel)

    axis.append("g")
        .attr("transform", `translate(${35},${500}) rotate(270)`)
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(yLabel)



    // Title
    axis.append('text')
        .attr('x', 500)
        .attr('y', 80)
        .attr("text-anchor", "middle")
        .text(title)
        .attr("class", "plotTitle")

    // Legend
    axis.selectAll("mydots")
        .data(islands)
        .enter()
        .append("rect")
        .attr("x", 1000 - margin - 100)
        .attr("y", function (d, i) {
            return 100 + i * (8 + 12)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 13)
        .attr("height", 13)
        // .attr("class", "my-1")
        .style("fill", function (d, i) {
            // return color(d)
            return colors[i];

        })

    // Add one dot in the legend for each name.
    axis.selectAll("mylabels")
        .data(islands)
        .enter()
        .append("text")
        .attr("x", (1000 - margin - 100) + 18 * 1.2)
        .attr("y", function (d, i) {
            return 100 + i * (8 + 12) + (8 / 1)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i) {
            return colors[i];
            // return color(d)
        })
        .text(function (d) {
            return d.toUpperCase()
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    // // Add a clipPath: everything out of this area won't be drawn.
    // var clip = axis.append("defs").append("svg:clipPath")
    //     .attr("id", "clip")
    //     .append("svg:rect")
    //     .attr("width", 1000 - margin * 1.5)
    //     .attr("height", 1000)
    //     .attr("x", 0)
    //     .attr("y", 0);

    // Add brushing
    var brush = d3.brushX() // Add the brush feature using the d3.brush function
        .extent([
            [0 + margin, 0 + margin],
            [1000, 1000 - margin]
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    // var scatter = axis.append('g')
    //     .attr("clip-path", "url(#clip)")

    // Add the brushing
    axis
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout

    function idled() {
        idleTimeout = null;
    }

    // A function that update the chart for given boundaries
    function updateChart({
        selection
    }) {

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!selection) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            xScale.domain(d3.extent(X)).range([0 + margin, 1000 - margin]);
        } else {
            xScale.domain([xScale.invert(selection[0]), xScale.invert(selection[1])])
            axis.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and circle position
        xAxis.transition().duration(900).call(d3.axisBottom(xScale))
        axis
            .selectAll("circle")
            .transition().duration(1000)
            .attr('transform', function (d, i) {
                return `translate(${xScale(X[i])}, 0)`
            })
        // .attr("cy", function (d, i) {
        //     return yScale(Y[i]);
        // })

    }

}