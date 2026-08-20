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

    var data = {"OkPercent": 98.25227963525836, "KoPercent": 1.7477203647416413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7723709993468322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11607142857142858, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/935271c3-7a43-43c3-a971-067cc49a4d4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f2ebc36-863b-4376-8811-e4e8169b90a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e4ec53-a692-44f1-a5cc-6ceedd9cdafc"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd3fa4b3-986c-437b-a876-fd0ad331c9be"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deb68e39-478b-4ec9-b58e-272b9800635a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bfc4484-e565-4be3-8f7e-d3d8f826472e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/725a9664-597d-419d-8c4f-377000dabfe4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e70456d2-7252-40d4-8a2d-fd4c40c31365"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99318c6d-37c1-43be-a351-1ab15e70d9d1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/efae2d8d-8ef1-4459-8a65-3951e5f5a9c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cbc003e-3fc8-4d2b-b14c-8fbb1a9d7beb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cf9dacf-9738-4ac2-8dc6-07828e617c89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ec28a27e-0521-4aaa-97f0-3704b09ce79d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33e702a0-b7dd-4ce1-b0b8-f9924839ab22"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b0e4ec53-a692-44f1-a5cc-6ceedd9cdafc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f2ebc36-863b-4376-8811-e4e8169b90a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cbc003e-3fc8-4d2b-b14c-8fbb1a9d7beb"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd3fa4b3-986c-437b-a876-fd0ad331c9be"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efae2d8d-8ef1-4459-8a65-3951e5f5a9c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725a9664-597d-419d-8c4f-377000dabfe4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=935271c3-7a43-43c3-a971-067cc49a4d4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bfc4484-e565-4be3-8f7e-d3d8f826472e"], "isController": false}, {"data": [0.9252873563218391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99318c6d-37c1-43be-a351-1ab15e70d9d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec28a27e-0521-4aaa-97f0-3704b09ce79d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e70456d2-7252-40d4-8a2d-fd4c40c31365"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cf9dacf-9738-4ac2-8dc6-07828e617c89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/343eef09-8a57-4a40-9eef-6fe9e5600483"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 23, 1.7477203647416413, 378.12537993920944, 93, 3725, 117.0, 1029.0999999999997, 1303.4499999999996, 2025.409999999998, 5.144382810881385, 723.4948867373336, 3.7672744287330984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1681.875, 1220, 2264, 1669.0, 2096.5, 2169.75, 2264.0, 0.24353437966140024, 293.0531571881238, 1.197456642182764], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/935271c3-7a43-43c3-a971-067cc49a4d4b", 3, 0, 0.0, 925.0, 209, 2089, 477.0, 2089.0, 2089.0, 2089.0, 0.02092823707506959, 0.02473646771470627, 0.013420777030562202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f2ebc36-863b-4376-8811-e4e8169b90a2", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e4ec53-a692-44f1-a5cc-6ceedd9cdafc", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 671.1428571428572, 103, 1591, 558.5, 1499.0, 1591.0, 1591.0, 0.07006901798271298, 0.013802658118246472, 0.04714604823250902], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 671.1428571428572, 103, 1591, 558.5, 1499.0, 1591.0, 1591.0, 0.06900188769449907, 0.013592447743391836, 0.04642802795069322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 170.2, 97, 311, 104.0, 309.2, 311.0, 311.0, 0.07844080595313423, 0.036697632264272306, 0.0438573985368175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 104.33333333333331, 99, 115, 105.0, 112.6, 115.0, 115.0, 0.07844121615261523, 0.05829469286341815, 0.039373813576605694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 201.26666666666668, 98, 788, 101.0, 743.6, 788.0, 788.0, 0.0784403957579434, 3.093533962076683, 0.045292179034973956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd3fa4b3-986c-437b-a876-fd0ad331c9be", 3, 0, 0.0, 374.3333333333333, 285, 504, 334.0, 504.0, 504.0, 504.0, 0.03540366073852036, 0.02951457524458029, 0.022703519418907917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 265.5333333333333, 99, 1153, 105.0, 992.2, 1153.0, 1153.0, 0.07836294581985927, 9.419787280518449, 0.04517093244069231], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 215.4, 101, 321, 208.0, 318.6, 321.0, 321.0, 0.07362975034605983, 0.1469670908762922, 0.047590895926802206], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/deb68e39-478b-4ec9-b58e-272b9800635a", 2, 0, 0.0, 342.5, 203, 482, 342.5, 482.0, 482.0, 482.0, 0.018007797376263922, 0.030238679285630676, 0.01119332327147655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bfc4484-e565-4be3-8f7e-d3d8f826472e", 3, 0, 0.0, 453.3333333333333, 321, 601, 438.0, 601.0, 601.0, 601.0, 0.032025620496397116, 0.026698442087002935, 0.020537263143848412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 112.2608695652174, 97, 318, 104.0, 107.2, 275.99999999999943, 318.0, 0.11622736093143597, 0.08637599772345973, 0.05834068703003719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 110.52173913043478, 98, 295, 102.0, 107.4, 257.7999999999995, 295.0, 0.11622794827350963, 0.03869000995517644, 0.06586184602828887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 761.5714285714286, 516, 824, 799.0, 824.0, 824.0, 824.0, 0.058986112983686126, 17.343875740486382, 0.03364051756100849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1145.5714285714287, 754, 1327, 1203.0, 1327.0, 1327.0, 1327.0, 0.05876427132303559, 52.87619463303811, 0.033456611505204834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 159.57142857142858, 96, 314, 104.0, 314.0, 314.0, 314.0, 0.05934768416858134, 0.10501758175143494, 0.03286146183943908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/725a9664-597d-419d-8c4f-377000dabfe4", 3, 0, 0.0, 278.3333333333333, 195, 440, 200.0, 440.0, 440.0, 440.0, 0.02020338069903697, 0.023879712017644283, 0.012955944002963161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e70456d2-7252-40d4-8a2d-fd4c40c31365", 3, 0, 0.0, 305.6666666666667, 213, 436, 268.0, 436.0, 436.0, 436.0, 0.031615888037601826, 0.031708512709586995, 0.020274511534529818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 104.25, 102, 106, 104.0, 106.0, 106.0, 106.0, 0.10360815396171678, 0.07699785660631492, 0.052006436656564875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 128.25, 100, 307, 103.0, 307.0, 307.0, 307.0, 0.10360949581029101, 0.027723634621113026, 0.0590897905793066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 149.75, 99, 293, 104.0, 293.0, 293.0, 293.0, 0.10361217961171336, 0.027926720285969615, 0.06091262902954243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 128.875, 100, 309, 104.0, 309.0, 309.0, 309.0, 0.10360815396171678, 0.027925635247493977, 0.06101144222550315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 102.71428571428571, 97, 106, 103.0, 106.0, 106.0, 106.0, 0.0593451684554996, 0.04410319647913594, 0.0333237029901487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 749.4000000000001, 100, 1248, 984.0, 1230.0, 1248.0, 1248.0, 0.09729077618581242, 58.37034858879729, 0.05162238449963354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 164.2173913043478, 98, 882, 105.0, 304.20000000000005, 767.3999999999984, 882.0, 0.11622677359529837, 4.576967114455578, 0.06789435933781059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 573.9333333333333, 100, 918, 787.0, 862.2, 918.0, 918.0, 0.09729077618581242, 19.079886672460873, 0.051717395023252496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 166.91304347826082, 95, 781, 104.0, 308.6, 686.5999999999987, 781.0, 0.11622736093143597, 1.5158215284655967, 0.06800820571484881], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 585.6153846153846, 106, 1406, 541.0, 1177.6, 1406.0, 1406.0, 0.07340527049842178, 0.013906857887396316, 0.05020695521996172], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/99318c6d-37c1-43be-a351-1ab15e70d9d1", 3, 0, 0.0, 322.3333333333333, 204, 446, 317.0, 446.0, 446.0, 446.0, 0.03767471649775835, 0.03062297105953861, 0.024159893066596338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efae2d8d-8ef1-4459-8a65-3951e5f5a9c8", 3, 0, 0.0, 900.3333333333334, 210, 1962, 529.0, 1962.0, 1962.0, 1962.0, 0.08962179602079225, 0.04055152879847046, 0.05747231059927108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cbc003e-3fc8-4d2b-b14c-8fbb1a9d7beb", 3, 0, 0.0, 605.3333333333333, 210, 1360, 246.0, 1360.0, 1360.0, 1360.0, 0.02058488520495684, 0.02433063742812444, 0.013200593702397453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 260.5, 208, 416, 210.5, 416.0, 416.0, 416.0, 0.10346745301930961, 0.16035434369301207, 0.23270072685885745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 735.2272727272726, 200, 2030, 663.0, 1336.9999999999998, 1942.2499999999986, 2030.0, 0.09467985298801009, 0.058157839384236666, 0.04280934759125847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 102.66666666666666, 96, 114, 102.0, 109.2, 114.0, 114.0, 0.0972926693216755, 0.07230441538456549, 0.04883635940560665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 190.20000000000002, 95, 401, 105.0, 345.8, 401.0, 401.0, 0.09729140722291407, 0.12345114106605438, 0.05003920032949357], "isController": false}, {"data": ["login", 22, 0, 0.0, 3388.681818181818, 1786, 5258, 3553.5, 5019.5, 5243.599999999999, 5258.0, 0.09620893081265934, 36.7523539414503, 0.19591978471065163], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cf9dacf-9738-4ac2-8dc6-07828e617c89", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 126.56521739130436, 101, 308, 107.0, 235.00000000000023, 306.2, 308.0, 0.11275228323373547, 0.09128090117262375, 0.04007991318074191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec28a27e-0521-4aaa-97f0-3704b09ce79d", 3, 0, 0.0, 1629.6666666666667, 191, 3725, 973.0, 3725.0, 3725.0, 3725.0, 0.03985651654045436, 0.025623899794074666, 0.025559029161684604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 858.0, 203, 1364, 1087.0, 1338.8, 1364.0, 1364.0, 0.09722897423432182, 77.59666560322476, 0.20208561213741694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 410.5333333333333, 203, 1264, 393.0, 1096.6000000000001, 1264.0, 1264.0, 0.07832080200501253, 12.59838540850825, 0.17347343782633667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 912.2, 101, 1431, 1220.5, 1425.0, 1431.0, 1431.0, 0.08024458549659362, 67.20673675864033, 0.14247332118296568], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1166.1304347826085, 166, 2319, 1138.0, 1922.2000000000007, 2274.1999999999994, 2319.0, 0.09491816403509495, 0.02961356442467212, 0.04282440603927136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33e702a0-b7dd-4ce1-b0b8-f9924839ab22", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 303.7826086956522, 203, 981, 211.0, 542.0000000000003, 909.999999999999, 981.0, 0.11616454960983863, 6.214517333139725, 0.25996454298088334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 109.33333333333334, 100, 125, 107.5, 120.5, 125.0, 125.0, 0.10089572986849923, 0.0783321340287665, 0.03586527897669309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 364.6111111111111, 202, 1393, 214.5, 700.9000000000011, 1393.0, 1393.0, 0.08757547302918696, 5.948779713324122, 0.1957144577375363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e4ec53-a692-44f1-a5cc-6ceedd9cdafc", 3, 0, 0.0, 1106.0, 199, 2613, 506.0, 2613.0, 2613.0, 2613.0, 0.04399601102833343, 0.0282851958922391, 0.028213587801372675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 145.1, 101, 300, 106.5, 299.4, 300.0, 300.0, 0.05017032826445784, 0.03728478496997306, 0.025183153054620436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 164.3, 102, 309, 105.0, 308.8, 309.0, 309.0, 0.050171083394374816, 0.013424684423885449, 0.028613195998354386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f2ebc36-863b-4376-8811-e4e8169b90a2", 3, 0, 0.0, 313.6666666666667, 208, 495, 238.0, 495.0, 495.0, 495.0, 0.04721435316336166, 0.03035427978438779, 0.03027743350645263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 143.7, 98, 294, 106.0, 293.7, 294.0, 294.0, 0.05017284545258416, 0.013523149750891823, 0.029496145471148105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 192.79999999999998, 93, 402, 108.0, 392.40000000000003, 402.0, 402.0, 0.05009618467457518, 0.013502487275569092, 0.02949999937379769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 2.7822818396226414, 5.831736438679245], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1158.4285714285713, 792, 1822, 1109.5, 1662.3, 1717.85, 1822.0, 0.24058599875410822, 287.8244957360428, 0.47506336863360044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1166.1304347826085, 166, 2319, 1138.0, 1922.2000000000007, 2274.1999999999994, 2319.0, 0.09773841799746731, 0.030493456837864714, 0.044096825307451064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 126.25000000000001, 99, 297, 102.5, 297.0, 297.0, 297.0, 0.036069343312518314, 0.009721815189702204, 0.021240052751414596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 103.125, 100, 111, 102.0, 111.0, 111.0, 111.0, 0.03606885544504459, 0.009721683694172175, 0.021204541970621917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 146.11111111111111, 96, 307, 104.0, 306.1, 307.0, 307.0, 0.10116679031496593, 0.02726761145208066, 0.059475007587509274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 113.1111111111111, 98, 308, 101.5, 127.10000000000028, 308.0, 308.0, 0.10116906474820143, 0.02726822448291367, 0.059575142620278784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 126.25, 94, 306, 101.5, 306.0, 306.0, 306.0, 0.03606966856483297, 0.009651454283949448, 0.020570982853381305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 104.61111111111113, 100, 115, 104.5, 107.80000000000001, 115.0, 115.0, 0.10116679031496593, 0.07518352288055574, 0.050780986544816886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 129.625, 94, 312, 104.0, 312.0, 312.0, 312.0, 0.03606771713892834, 0.02680423119406686, 0.018104303329501137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 135.88888888888889, 98, 312, 102.5, 309.3, 312.0, 312.0, 0.10116679031496593, 0.027070020064746746, 0.05769668510150401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 165.0, 107, 321, 127.0, 321.0, 321.0, 321.0, 0.03647654785951057, 0.028711032787856958, 0.012966272871935402], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 762.8461538461539, 103, 3725, 477.0, 2778.999999999999, 3725.0, 3725.0, 0.07315618282292827, 0.013705793266254741, 0.04978928909072492], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1743.6818181818185, 908, 3066, 1586.0, 2843.7, 3055.2, 3066.0, 0.09683567426239827, 0.05012002671784285, 0.04454062751717733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 260.375, 203, 619, 208.5, 619.0, 619.0, 619.0, 0.03605048870943756, 0.055871216388552164, 0.08107839404085422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cbc003e-3fc8-4d2b-b14c-8fbb1a9d7beb", 1, 0, 0.0, 1406.0, 1406, 1406, 1406.0, 1406.0, 1406.0, 1406.0, 0.7112375533428166, 0.1284950657894737, 0.4903649537695591], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1074.4576271186443, 526, 3426, 838.0, 1810.0, 2215.0, 3426.0, 0.2715202834855841, 78.08972519357326, 0.9890518218320716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd3fa4b3-986c-437b-a876-fd0ad331c9be", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 189.0892857142857, 97, 700, 107.0, 418.3, 433.5999999999999, 700.0, 0.24150422632396068, 0.17947726194583405, 0.11674276565464896], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 648.9464285714287, 465, 925, 609.5, 835.6, 887.15, 925.0, 0.24145216229034622, 70.99495267968784, 0.12143346052688311], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 156.82142857142856, 99, 423, 106.0, 309.0, 314.65, 423.0, 0.24195499637067505, 0.42814692717154607, 0.1176695197193322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efae2d8d-8ef1-4459-8a65-3951e5f5a9c8", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725a9664-597d-419d-8c4f-377000dabfe4", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 967.7500000000002, 690, 1417, 984.5, 1268.8000000000002, 1318.8, 1417.0, 0.24135226224647238, 217.16918982139933, 0.12114752226043632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 129.16666666666666, 104, 298, 107.5, 295.3, 298.0, 298.0, 0.08228007222361895, 0.06146899926862159, 0.02924799442323955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=935271c3-7a43-43c3-a971-067cc49a4d4b", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bfc4484-e565-4be3-8f7e-d3d8f826472e", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 188.74712643678166, 98, 2003, 108.0, 320.5, 360.5, 1912.25, 0.7083536883243771, 1.4810323288145255, 0.3409659779046572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 110.9, 103, 138, 107.0, 136.20000000000002, 138.0, 138.0, 0.04914801908909062, 0.03806091712661021, 0.01747058491057518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99318c6d-37c1-43be-a351-1ab15e70d9d1", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 106.6, 100, 117, 106.0, 115.8, 117.0, 117.0, 0.08165931732810713, 0.06626844990200882, 0.029027335456475584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 362.0, 210, 607, 311.0, 606.5, 607.0, 607.0, 0.050069095351585186, 0.07759731867477118, 0.11260656894013739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 287.22222222222223, 205, 416, 213.5, 414.2, 416.0, 416.0, 0.10110712299681514, 0.15669629316010314, 0.22739228931803246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec28a27e-0521-4aaa-97f0-3704b09ce79d", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e70456d2-7252-40d4-8a2d-fd4c40c31365", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 134.87499999999997, 102, 288, 109.5, 288.0, 288.0, 288.0, 0.09943693833666861, 0.0824433209451481, 0.03534672417436267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cf9dacf-9738-4ac2-8dc6-07828e617c89", 3, 0, 0.0, 371.0, 203, 458, 452.0, 458.0, 458.0, 458.0, 0.017086131187315255, 0.02355461119084639, 0.010956926575198912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 134.53333333333333, 98, 318, 108.0, 309.6, 318.0, 318.0, 0.09376699526789231, 0.07279761839645936, 0.03333123659913359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 114.16666666666664, 98, 312, 103.5, 127.50000000000028, 312.0, 312.0, 0.08761980791790996, 0.06511589240774365, 0.04398103639629466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 147.2222222222222, 97, 315, 104.0, 311.4, 315.0, 315.0, 0.08762066095185245, 0.030756601364935184, 0.04956233784092955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 223.33333333333334, 96, 1289, 101.5, 407.9000000000014, 1289.0, 1289.0, 0.08762449981014692, 4.402565397389277, 0.051095275822453295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 175.61111111111111, 98, 599, 103.5, 340.7000000000004, 599.0, 599.0, 0.08762322015334063, 1.453646023487891, 0.05118009918461725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/343eef09-8a57-4a40-9eef-6fe9e5600483", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.60790273556231], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1519756838905775], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07598784194528875], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.9118541033434651], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 23, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
