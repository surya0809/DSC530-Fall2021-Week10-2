let palmer_penguin_species = "../data/palmer_penguin_species.tsv";
// loading data
d3.tsv(palmer_penguin_species).then(main)

function plot(data, specie, main_axis, top_axis, right_axis) {

    // fetch data from table
    let culmen_length_mm = d3.map(data, function (d) {
        return +d.culmen_length_mm
    });
    let culmen_depth_mm = d3.map(data, function (d) {
        return +d.culmen_depth_mm
    });
    let flipper_length_mm = d3.map(data, function (d) {
        return +d.flipper_length_mm
    });

    let islands_code = d3.map(data, function (d) {
        island = d.island
        if (island === "Biscoe") {
            return 0
        } else if (island === "Dream") {
            return 1
        } else if (island === "Torgersen") {
            return 2
        } else {
            return 3
        }
    })


    // main svg
    scatter_plot(culmen_length_mm,
        culmen_depth_mm, flipper_length_mm,
        islands_code, main_axis, title = `Penguin Species - ${specie}`,
        xLabel = "culmen_length_mm",
        yLabel = "culmen_depth_mm");
    //#############
    bar_plot(culmen_length_mm, 10, top_axis)
    h_bar_plot(culmen_depth_mm, 10, right_axis)

}

function main(data) {

    let species = new Set(data.map(d => d.species));

    species = [...species];

    var color = d3.scaleOrdinal()
        .domain(species)
        .range(d3.schemeSet1);

    d3.range(species.length).forEach(ele => {

        d3.select(`#header_${ele + 1}`)
            .text(species[ele])

        let d = data.filter(d => d.species === species[ele]);

        plot(d, species[ele], `main_${ele + 1}`, `top_${ele + 1}`, `right_${ele + 1}`)

    });

}