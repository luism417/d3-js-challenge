const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function displayMetadata(metadata) {
  var metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html("");
  Object.entries(metadata).forEach(([key, value]) => {
    metadataDiv.append("h6").text(`${key}: ${value}`);
  });
}

function buildBarChart(sample) {
  // Extract top 10 OTUs
  var topOTUs = sample.otu_ids.slice(0, 10);
  var topValues = sample.sample_values.slice(0, 10);
  var topLabels = sample.otu_labels.slice(0, 10);

  var trace = {
    x: topValues,
    y: topOTUs.map(otu => `OTU ${otu}`),
    text: topLabels,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: "Top 10 OTUs Found",
    xaxis: { title: "Values" },
    yaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bar", [trace], layout);
}

function buildBubbleChart(sample) {
  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: 'markers',
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids
    }
  };

  var layout = {
    title: "Bubble Chart of Samples",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Values" }
  };

  Plotly.newPlot("bubble", [trace], layout);
}

function optionChanged(newSample) {
  d3.json(url).then(data => {
    var selectedSample = data.samples.find(sample => sample.id === newSample);
    var selectedMetadata = data.metadata.find(meta => meta.id === parseInt(newSample));
    buildBarChart(selectedSample);
    buildBubbleChart(selectedSample);
    displayMetadata(selectedMetadata);
  });
}

function init() {
  var selector = d3.select("#selDataset");

  // Load the data and populate the dropdown
  d3.json(url).then(data => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Build the initial plots and metadata display
    var firstSample = sampleNames[0];
    var selectedSample = data.samples.find(sample => sample.id === firstSample);
    var selectedMetadata = data.metadata.find(meta => meta.id === parseInt(firstSample));
    buildBarChart(selectedSample);
    buildBubbleChart(selectedSample);
    displayMetadata(selectedMetadata);

    // Add event listener for changes to the dropdown
    selector.on("change", optionChanged);
  });
}

init();
