document.body.style.backgroundColor = "lightsteelblue";

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = samples.filter(sampleObj => sampleObj.id == sample)[0];
    var metaResult = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids
    var otu_labels = sampleResult.otu_labels
    var sample_values = sampleResult.sample_values
    console.log(sample_values);
    var wfreq = parseFloat(metaResult.wfreq)
    console.log(wfreq);
    // Create the yticks for the bar chart (OTU ID labels)
    var yticks = otu_ids.slice(0,10).map(otu_id => "OTU " + otu_id).reverse()
    console.log(yticks);
    //  Create the trace for the bar chart.
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {color: "teal"}
    }];

    // Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Bacteria Sample Values"},
    };
    //  Plot the data
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        opacity: 0.5,
        colorscale: "RdBu"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Bacteria Sample Values"},
      hovermode: "closest"
    };

    // // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      donain: {x: [0,1], y: [0,1]},
      value: wfreq,
      title: "Washing Frequency (per Week)",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: "black"},
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color: "paleturquoise"},
          {range: [2,4], color: "turquoise"},
          {range: [4,6], color: "darkturquoise"},
          {range: [6,8], color: "teal"},
          {range: [8,10], color: "darkslategray"},
        ]
      }

    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 450,
      margin: {t:0, b:0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}