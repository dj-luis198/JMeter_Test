/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.38461538461539, "KoPercent": 2.6153846153846154};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7277851458885941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abec1867-e0da-457e-b065-ebf013c313a1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffd829f5-cb85-4ee0-a685-6c6d9e5956d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2239189-7705-45c8-8e01-2af2bbe6b62d"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffc840aa-0120-4d36-afc4-e6ee435e2a2b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f07fe4e8-5424-4b66-8fa4-2f15047265fc"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61828207-25a8-4f53-8b96-815065dafd26"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1bc887a4-f6d3-40b1-858d-d39b0dd9adaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f07fe4e8-5424-4b66-8fa4-2f15047265fc"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.42727272727272725, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8988439306358381, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/55c2e7b9-7451-43f7-b6cc-ca4cfad02717"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55c2e7b9-7451-43f7-b6cc-ca4cfad02717"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bc887a4-f6d3-40b1-858d-d39b0dd9adaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b219f90c-5a2a-4b0b-ad93-fbf4a1057fad"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/506dd25d-f3c4-4428-ba2f-f15948433e5b"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61828207-25a8-4f53-8b96-815065dafd26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f0ef9b4-4b25-414b-8a92-0dc0338415ad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=506dd25d-f3c4-4428-ba2f-f15948433e5b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f0ef9b4-4b25-414b-8a92-0dc0338415ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a96580c7-25cf-4330-afbc-1cc5df116cb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e12da654-562d-4abb-8363-bf76bd37520b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a96580c7-25cf-4330-afbc-1cc5df116cb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2239189-7705-45c8-8e01-2af2bbe6b62d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abec1867-e0da-457e-b065-ebf013c313a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b219f90c-5a2a-4b0b-ad93-fbf4a1057fad"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 34, 2.6153846153846154, 457.68461538461554, 124, 4240, 150.0, 1284.0, 1538.8500000000001, 2075.92, 5.040615730598476, 699.0553502925012, 3.700899434869429], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2167.236363636364, 1527, 3170, 2118.0, 2582.2, 2700.7999999999997, 3170.0, 0.2421755288232911, 291.4182375166771, 1.1907751832278035], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 390.75, 252, 574, 296.0, 572.6, 574.0, 574.0, 0.09374542258678775, 0.14528709535667203, 0.21083565255602751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 179.3846153846154, 130, 415, 137.0, 402.2, 415.0, 415.0, 0.09904007313728477, 0.0768914630313881, 0.0352056509980192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abec1867-e0da-457e-b065-ebf013c313a1", 3, 0, 0.0, 398.0, 250, 495, 449.0, 495.0, 495.0, 495.0, 0.026649847651704257, 0.02672792337724636, 0.01708990881310462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 376.05555555555554, 255, 801, 290.0, 594.9000000000003, 801.0, 801.0, 0.08604988024724998, 0.1333605077660017, 0.1935281974701335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 135.66666666666666, 128, 149, 131.0, 149.0, 149.0, 149.0, 0.042161280953407106, 0.03133274883353789, 0.02116298672856567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffd829f5-cb85-4ee0-a685-6c6d9e5956d4", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.6897104481641468, 1.28872502699784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 165.55555555555554, 127, 419, 129.0, 419.0, 419.0, 419.0, 0.04216246603579125, 0.011281753607233205, 0.024045781411037196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 192.11111111111111, 129, 393, 136.0, 393.0, 393.0, 393.0, 0.04216404624927384, 0.01136452809062459, 0.024787847502014505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 158.7777777777778, 127, 377, 131.0, 377.0, 377.0, 377.0, 0.04216286107805751, 0.011364208649945189, 0.024828325419988945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 141.0, 136, 147, 140.0, 147.0, 147.0, 147.0, 0.048343431739074384, 0.014257535532422328, 0.029884172159017664], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1494.5636363636363, 1007, 2562, 1386.0, 2028.0, 2091.7999999999997, 2562.0, 0.24644337403382996, 294.83195292371454, 0.48662939677383216], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 654.2307692307693, 132, 1646, 548.0, 1515.6, 1646.0, 1646.0, 0.0740285180629584, 0.015326216630221857, 0.049498786003485035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 654.2307692307693, 132, 1646, 548.0, 1515.6, 1646.0, 1646.0, 0.07609191903819813, 0.01575340511337696, 0.05087846840136731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2239189-7705-45c8-8e01-2af2bbe6b62d", 3, 0, 0.0, 405.0, 240, 506, 469.0, 506.0, 506.0, 506.0, 0.021466905187835422, 0.021669555008944543, 0.01376621198568873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 1357.9545454545455, 133, 2462, 1375.0, 2093.6, 2407.5499999999993, 2462.0, 0.0871618516346809, 0.02700593592019144, 0.0393249760304908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc840aa-0120-4d36-afc4-e6ee435e2a2b", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 224.27272727272728, 129, 515, 133.0, 512.6, 515.0, 515.0, 0.0580974664223052, 0.01565908274663695, 0.034211691652978556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 226.1764705882353, 125, 446, 133.0, 432.4, 446.0, 446.0, 0.10624269581466274, 0.04720134475129835, 0.059541804938410485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 156.36363636363635, 125, 388, 131.0, 340.00000000000017, 388.0, 388.0, 0.058214918896033446, 0.015690739858696515, 0.03422400505411341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 132.2941176470588, 126, 149, 130.0, 143.4, 149.0, 149.0, 0.10641960624745689, 0.07908722690851043, 0.05341765391718051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f07fe4e8-5424-4b66-8fa4-2f15047265fc", 3, 0, 0.0, 687.3333333333334, 267, 1134, 661.0, 1134.0, 1134.0, 1134.0, 0.02223342127886639, 0.02627915125767053, 0.014257760390418879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 248.88235294117646, 126, 1021, 132.0, 799.3999999999999, 1021.0, 1021.0, 0.10641760773217818, 3.706521364899717, 0.06158992405225731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 291.7647058823529, 125, 1427, 133.0, 1305.3999999999999, 1427.0, 1427.0, 0.10641960624745689, 11.290785216282199, 0.061487155310025354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 209.15384615384616, 127, 388, 133.0, 387.2, 388.0, 388.0, 0.09610124635924124, 0.02590228905776424, 0.05649702178541331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 229.9230769230769, 127, 393, 135.0, 391.8, 393.0, 393.0, 0.09591264571344253, 0.02585145528995131, 0.056479809926958835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 177.0, 126, 396, 129.0, 392.0, 396.0, 396.0, 0.058214918896033446, 0.015577038845227698, 0.03320069593289407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 156.0, 130, 391, 134.0, 293.3999999999999, 391.0, 391.0, 0.0960969840331165, 0.0714158250480485, 0.04823618143849793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 154.0, 127, 382, 130.0, 334.4000000000002, 382.0, 382.0, 0.05821122206522832, 0.043260488273084714, 0.029219304825710307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 194.92307692307696, 127, 392, 144.0, 386.4, 392.0, 392.0, 0.09609840476648088, 0.02571383096290602, 0.05480612146838363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 139.1818181818182, 129, 154, 134.0, 153.0, 154.0, 154.0, 0.058671673316122976, 0.04618102411405773, 0.02085594637409059], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 555.4166666666666, 134, 1104, 504.0, 1039.8000000000002, 1104.0, 1104.0, 0.07537925186092527, 0.014710241370646063, 0.051295679041427185], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/61828207-25a8-4f53-8b96-815065dafd26", 3, 0, 0.0, 393.6666666666667, 277, 547, 357.0, 547.0, 547.0, 547.0, 0.04204860819106888, 0.02703320350825554, 0.026964765018361224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1733.8571428571427, 1056, 4240, 1507.0, 3012.0000000000005, 4133.299999999998, 4240.0, 0.08773395721925134, 0.045409177076370315, 0.040354193213151736], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 221.6153846153846, 131, 299, 232.0, 290.2, 299.0, 299.0, 0.07414420477488678, 0.1454812671814936, 0.04791636070300113], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 406.0, 260, 779, 276.0, 752.4000000000001, 779.0, 779.0, 0.058052701297741746, 0.0899703485932775, 0.13056188582880787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bc887a4-f6d3-40b1-858d-d39b0dd9adaf", 3, 0, 0.0, 420.0, 235, 554, 471.0, 554.0, 554.0, 554.0, 0.0477516912057302, 0.030699736370871467, 0.03062201551929964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 136.43750000000003, 125, 150, 134.0, 148.6, 150.0, 150.0, 0.09396454013166781, 0.06983106937519454, 0.04716579455827857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 198.9375, 126, 427, 134.0, 406.0, 427.0, 427.0, 0.09382733424814983, 0.02510614217186822, 0.05351090156339795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 910.75, 751, 1172, 895.5, 1172.0, 1172.0, 1172.0, 0.04432722356435204, 13.033675530264413, 0.025280369689044527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1409.25, 1242, 1712, 1363.0, 1712.0, 1712.0, 1712.0, 0.04425194846860601, 39.81798101867986, 0.02519422456757549], "isController": false}, {"data": ["addBook", 59, 14, 23.728813559322035, 1257.9322033898304, 667, 3230, 1047.0, 2137.0, 2642.0, 3230.0, 0.28084138173959816, 69.41805255244356, 1.0243579695287102], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 330.125, 127, 436, 389.0, 436.0, 436.0, 436.0, 0.0444797811594767, 0.07870836275485525, 0.024628941325608677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 132.61538461538464, 126, 147, 131.0, 142.6, 147.0, 147.0, 0.0730521761119384, 0.0542897519738136, 0.03666876808743783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 172.23076923076925, 125, 391, 131.0, 390.2, 391.0, 391.0, 0.0729455994164352, 0.02794640602642875, 0.04113053404595573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f07fe4e8-5424-4b66-8fa4-2f15047265fc", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 260.30769230769226, 126, 1524, 133.0, 1072.3999999999996, 1524.0, 1524.0, 0.07294314362504979, 5.066945718027056, 0.04240039403325085], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 223.79999999999998, 126, 597, 136.0, 527.8, 582.1999999999999, 597.0, 0.24743121412247393, 0.18388198627656513, 0.11960786229553184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 203.6923076923077, 128, 1034, 133.0, 679.1999999999997, 1034.0, 1034.0, 0.0730521761119384, 1.6704648822736083, 0.04253511245820572], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 871.1818181818182, 623, 1308, 783.0, 1162.0, 1208.1999999999996, 1308.0, 0.2473143905498923, 72.71864243229206, 0.12438174915351029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 161.125, 126, 375, 132.0, 375.0, 375.0, 375.0, 0.044542189805406314, 0.03310215472843184, 0.025011483533309207], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 202.21818181818185, 125, 580, 135.0, 425.2, 439.0, 580.0, 0.24790073153252234, 0.4386680913446586, 0.12056109795233996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 806.7058823529413, 127, 1702, 1123.0, 1674.8, 1702.0, 1702.0, 0.10544466636067037, 50.243590020670254, 0.05719258615449504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 151.06249999999997, 125, 397, 132.5, 226.20000000000016, 397.0, 397.0, 0.09396785124889147, 0.02532727240692778, 0.05524281880061784], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1254.6727272727271, 872, 2025, 1251.0, 1556.2, 1571.0, 2025.0, 0.24704999842786365, 222.29602285296707, 0.12400751874211124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 675.3529411764705, 131, 1174, 835.0, 1148.4, 1174.0, 1174.0, 0.10527880304193812, 16.401540031490747, 0.05720543416668731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 156.11111111111114, 129, 391, 137.0, 191.20000000000033, 391.0, 391.0, 0.08819508753362439, 0.06588793160470963, 0.031350597521718045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 188.18750000000003, 124, 435, 144.5, 409.1, 435.0, 435.0, 0.09381743127873159, 0.025286729524345623, 0.05524600689558119], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 465.46153846153845, 136, 799, 483.0, 760.5999999999999, 799.0, 799.0, 0.07646788936861051, 0.015831242720845146, 0.051463027407856195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 14, 8.092485549132949, 212.69364161849717, 128, 1116, 141.0, 411.9999999999999, 496.19999999999993, 1057.5399999999993, 0.7183281638618652, 1.5101467745819788, 0.3454180758147627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 166.88888888888886, 129, 380, 143.0, 380.0, 380.0, 380.0, 0.04199230141140791, 0.03251942872973288, 0.014926950892336406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55c2e7b9-7451-43f7-b6cc-ca4cfad02717", 3, 0, 0.0, 664.0, 223, 1104, 665.0, 1104.0, 1104.0, 1104.0, 0.016478355679814562, 0.022716743588546445, 0.010567174703526918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55c2e7b9-7451-43f7-b6cc-ca4cfad02717", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 415.92307692307696, 259, 1660, 272.0, 1207.1999999999996, 1660.0, 1660.0, 0.072889975385616, 6.812102609461119, 0.16249667965136164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bc887a4-f6d3-40b1-858d-d39b0dd9adaf", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 136.8235294117647, 129, 147, 135.0, 147.0, 147.0, 147.0, 0.10419411977420522, 0.08455597024644973, 0.03703775351348701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 970.952380952381, 137, 2059, 967.0, 1789.4000000000003, 2042.5999999999997, 2059.0, 0.08997236563055633, 0.055266228497675714, 0.040680864538034746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 138.94117647058823, 127, 202, 133.0, 167.59999999999997, 202.0, 202.0, 0.10543158730355615, 0.07835296673633421, 0.05292171472073033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 239.76470588235293, 127, 455, 145.0, 444.59999999999997, 455.0, 455.0, 0.10544466636067037, 0.11205918702162235, 0.055448097188969245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b219f90c-5a2a-4b0b-ad93-fbf4a1057fad", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["login", 21, 0, 0.0, 3825.47619047619, 2225, 8596, 3559.0, 4805.6, 8218.899999999994, 8596.0, 0.0853498939222747, 39.01181556243548, 0.1826902096051145], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 332.55555555555554, 262, 548, 277.0, 548.0, 548.0, 548.0, 0.04213325343620089, 0.06529831367504962, 0.09475867447614321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 158.75, 130, 433, 137.5, 236.30000000000018, 433.0, 433.0, 0.09492056335354351, 0.07684487013680426, 0.03374129400457992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/506dd25d-f3c4-4428-ba2f-f15948433e5b", 3, 0, 0.0, 491.33333333333337, 285, 890, 299.0, 890.0, 890.0, 890.0, 0.04284123040013709, 0.027542783216233973, 0.02747305465112958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 429.84615384615387, 265, 783, 511.0, 680.9999999999999, 783.0, 783.0, 0.09581862271785838, 0.1485001506379309, 0.21549832824143345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61828207-25a8-4f53-8b96-815065dafd26", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f0ef9b4-4b25-414b-8a92-0dc0338415ad", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=506dd25d-f3c4-4428-ba2f-f15948433e5b", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f0ef9b4-4b25-414b-8a92-0dc0338415ad", 3, 0, 0.0, 360.6666666666667, 228, 513, 341.0, 513.0, 513.0, 513.0, 0.01870825720112, 0.025790842853757552, 0.011997157124416147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a96580c7-25cf-4330-afbc-1cc5df116cb4", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e12da654-562d-4abb-8363-bf76bd37520b", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a96580c7-25cf-4330-afbc-1cc5df116cb4", 3, 0, 0.0, 1142.0, 232, 2672, 522.0, 2672.0, 2672.0, 2672.0, 0.0465267761596799, 0.02991223402192962, 0.02983650684719056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2239189-7705-45c8-8e01-2af2bbe6b62d", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 178.2307692307692, 132, 397, 136.0, 395.4, 397.0, 397.0, 0.07265045630075054, 0.06023460683529024, 0.025824966888157417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 994.7058823529412, 266, 1905, 1250.0, 1820.1999999999998, 1905.0, 1905.0, 0.10517979557997377, 66.69344014496251, 0.22230470006743883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abec1867-e0da-457e-b065-ebf013c313a1", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 138.94117647058826, 128, 154, 140.0, 151.6, 154.0, 154.0, 0.10321546531960366, 0.08013310051668447, 0.03668987243782786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b219f90c-5a2a-4b0b-ad93-fbf4a1057fad", 3, 0, 0.0, 1240.3333333333333, 229, 3016, 476.0, 3016.0, 3016.0, 3016.0, 0.018304960644334616, 0.025234865992433953, 0.011738532704863018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 1037.3846153846152, 131, 1842, 1374.0, 1822.8, 1842.0, 1842.0, 0.07185774377739576, 52.91006804721054, 0.1179293966575094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 489.05882352941165, 258, 1553, 273.0, 1434.6, 1553.0, 1553.0, 0.10615777543259294, 15.08653346662899, 0.23555585889446043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 149.7777777777778, 126, 405, 133.5, 176.40000000000038, 405.0, 405.0, 0.0861038029179622, 0.06398925197321215, 0.04322007294905525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 188.44444444444443, 125, 395, 130.5, 393.2, 395.0, 395.0, 0.08611245329595416, 0.02304180879208148, 0.04911100852034885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 176.11111111111111, 126, 394, 132.5, 393.1, 394.0, 394.0, 0.08611368920612747, 0.02321033029383904, 0.050625430568446025], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 1357.9545454545455, 133, 2462, 1375.0, 2093.6, 2407.5499999999993, 2462.0, 0.08861248952761488, 0.027455396702004253, 0.039979463048591866], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 193.72222222222226, 126, 444, 132.5, 430.5, 444.0, 444.0, 0.0861141011840689, 0.02321044133476857, 0.05070976856835307], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6923076923076923], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.823529411764707, 0.23076923076923078], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.15384615384615385], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.5384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 34, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
