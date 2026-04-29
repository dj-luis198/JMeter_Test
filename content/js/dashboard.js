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

    var data = {"OkPercent": 98.17427385892117, "KoPercent": 1.8257261410788381};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7204724409448819, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f18fee88-1b53-439e-b9a4-234f22fdafa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7499515-e4aa-4e28-bb55-2a00efa25297"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a300e48b-7ab8-41cc-9136-a79f48d10ab7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a300e48b-7ab8-41cc-9136-a79f48d10ab7"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c72f5ec9-dd0b-4dfc-95db-35778b26a036"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/431b4959-1921-4158-a671-6078b0d81d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b580144d-1b5d-47d0-9516-89f78e32fb33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9019607843137255, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba28ed34-4ac9-4b3b-9824-e3247fe2d987"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9901960784313726, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba28ed34-4ac9-4b3b-9824-e3247fe2d987"], "isController": false}, {"data": [0.9233128834355828, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=431b4959-1921-4158-a671-6078b0d81d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ebfaf59-1f4d-4e63-b623-15108cfa6936"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd35e516-61f0-4232-8a5e-b9f94f1f920f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce76a6b8-5b0f-4540-a4d5-869e212abcc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/519d6ac1-ea34-4d64-b207-6ee755f1c790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ebfaf59-1f4d-4e63-b623-15108cfa6936"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce76a6b8-5b0f-4540-a4d5-869e212abcc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d693535-a5c9-45ae-a713-ad821723bd4a"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4284ad6-6f72-4f4d-8bdf-98b23fbfd8a3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ece59dcc-44c3-417d-91bf-89eaf286ace5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d693535-a5c9-45ae-a713-ad821723bd4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ece59dcc-44c3-417d-91bf-89eaf286ace5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7499515-e4aa-4e28-bb55-2a00efa25297"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28c5118e-6cd0-44e2-82fb-7083b11e58fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd35e516-61f0-4232-8a5e-b9f94f1f920f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1205, 22, 1.8257261410788381, 511.9717842323649, 141, 4883, 164.0, 1471.8000000000002, 1760.7, 2239.5200000000004, 4.690595841913296, 664.328904343229, 3.4267936480865875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 2545.196078431372, 1787, 3321, 2443.0, 3021.2000000000003, 3222.2, 3321.0, 0.23343845692602747, 280.90398148455415, 1.1478150689673323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 378.6666666666667, 294, 605, 301.0, 596.6, 605.0, 605.0, 0.09159969711033489, 0.14196163995517722, 0.2060098656690442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 155.6153846153846, 150, 167, 155.0, 164.6, 167.0, 167.0, 0.10816657652785289, 0.08397698080043267, 0.038449837750135205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 647.1666666666667, 295, 1903, 588.0, 1773.4, 1903.0, 1903.0, 0.10313590447323337, 13.851680184154889, 0.22902303440155394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 181.59999999999997, 149, 424, 150.5, 400.4000000000001, 424.0, 424.0, 0.048628434991076684, 0.0361389053009857, 0.02440919490763029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 177.6, 144, 443, 149.0, 413.7000000000001, 443.0, 443.0, 0.0486291444188331, 0.013012095283945573, 0.02773380892636575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 208.0, 147, 444, 149.0, 443.8, 444.0, 444.0, 0.04862867146469558, 0.013106946605718733, 0.028588340060299554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f18fee88-1b53-439e-b9a4-234f22fdafa6", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.48828125, 0.9123542622324159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 148.8, 143, 159, 148.5, 158.3, 159.0, 159.0, 0.04862867146469558, 0.013106946605718733, 0.028635828997276798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7499515-e4aa-4e28-bb55-2a00efa25297", 3, 0, 0.0, 502.0, 285, 877, 344.0, 877.0, 877.0, 877.0, 0.02460468473197297, 0.02467676876927367, 0.015778394831375893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 157.5, 156, 159, 157.5, 159.0, 159.0, 159.0, 0.02072431480234185, 0.006112053779596912, 0.012811026630744522], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1805.0196078431372, 1175, 2701, 1764.0, 2358.8, 2582.6, 2701.0, 0.24398178269355889, 291.887033893136, 0.4817687154359141], "isController": false}, {"data": ["deleteBook", 11, 2, 18.181818181818183, 555.090909090909, 153, 1143, 515.0, 1103.8000000000002, 1143.0, 1143.0, 0.11650074136835416, 0.023467700831391654, 0.07817050810209701], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, 18.181818181818183, 555.090909090909, 153, 1143, 515.0, 1103.8000000000002, 1143.0, 1143.0, 0.11459765804058841, 0.023084347131933157, 0.07689356351835647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1240.1904761904761, 159, 2364, 1312.0, 2251.4, 2358.7, 2364.0, 0.08847544174524127, 0.027796692914381048, 0.03991763094365378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 148.0, 142, 152, 148.0, 152.0, 152.0, 152.0, 0.03331945022907122, 0.008980633069554354, 0.0196207309454394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 201.75, 143, 444, 148.5, 442.6, 444.0, 444.0, 0.10844957772445674, 0.0290187346645519, 0.061850149795979234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 147.83333333333334, 145, 150, 148.0, 150.0, 150.0, 150.0, 0.03331963526105934, 0.0089806829414574, 0.019588301198396215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 186.375, 145, 448, 150.0, 447.3, 448.0, 448.0, 0.1086698135633511, 0.0807595001188576, 0.05454715251129147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 218.0, 143, 446, 148.0, 433.40000000000003, 446.0, 446.0, 0.10866833744235485, 0.029289512826259703, 0.06399121823998044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 330.68750000000006, 143, 445, 440.5, 445.0, 445.0, 445.0, 0.10866759939689483, 0.029289313899944307, 0.06388466292669012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a300e48b-7ab8-41cc-9136-a79f48d10ab7", 1, 0, 0.0, 1142.0, 1142, 1142, 1142.0, 1142.0, 1142.0, 1142.0, 0.8756567425569177, 0.1581997044658494, 0.6037242775831875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a300e48b-7ab8-41cc-9136-a79f48d10ab7", 3, 0, 0.0, 375.0, 279, 535, 311.0, 535.0, 535.0, 535.0, 0.022176554946110972, 0.02621193717751593, 0.014221293373645383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 318.46153846153845, 143, 1327, 149.0, 1036.1999999999998, 1327.0, 1327.0, 0.10330906894688324, 7.176294008173337, 0.06005150056422645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 285.07692307692304, 142, 1189, 149.0, 953.7999999999997, 1189.0, 1189.0, 0.10330906894688324, 2.362341286476048, 0.06015238832686989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 145.83333333333334, 142, 151, 146.0, 151.0, 151.0, 151.0, 0.03331945022907122, 0.008915556018325698, 0.01900249895876718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 171.92307692307693, 147, 437, 150.0, 324.9999999999999, 437.0, 437.0, 0.10307234886025768, 0.07659966551040634, 0.05173748761149653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 150.16666666666666, 149, 151, 150.5, 151.0, 151.0, 151.0, 0.03331963526105934, 0.024761955501627107, 0.016724895043148925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 193.6923076923077, 144, 446, 148.0, 444.4, 446.0, 446.0, 0.10330988993523264, 0.03957935987602813, 0.05825150494695435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 208.83333333333334, 151, 457, 160.0, 457.0, 457.0, 457.0, 0.03424872566199933, 0.02695749305036275, 0.012174351700163824], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 533.9999999999999, 148, 1003, 527.0, 977.8000000000001, 1003.0, 1003.0, 0.11399436246062013, 0.02239608701396949, 0.07757162537825403], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c72f5ec9-dd0b-4dfc-95db-35778b26a036", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1768.3999999999996, 967, 4883, 1388.5, 3322.1000000000017, 4809.249999999999, 4883.0, 0.09192063572311666, 0.04757611028637874, 0.04227990178280073], "isController": false}, {"data": ["goToProfile", 11, 2, 18.181818181818183, 269.72727272727275, 148, 466, 270.0, 435.0000000000001, 466.0, 466.0, 0.11699887255631901, 0.2632993981205727, 0.07561716905273458], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 300.3333333333333, 298, 302, 300.5, 302.0, 302.0, 302.0, 0.033291718684977115, 0.05159566167290887, 0.0748738555971702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/431b4959-1921-4158-a671-6078b0d81d3e", 3, 0, 0.0, 607.3333333333334, 245, 1080, 497.0, 1080.0, 1080.0, 1080.0, 0.021289883047575793, 0.021352255751816734, 0.013652691928295673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 150.0666666666667, 142, 160, 150.0, 158.2, 160.0, 160.0, 0.09168479988264346, 0.06813684835028483, 0.046021471816092514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1123.6, 884, 1192, 1177.0, 1192.0, 1192.0, 1192.0, 0.026203802695847222, 7.704788040715468, 0.014944356224975367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 187.26666666666665, 143, 444, 149.0, 435.6, 444.0, 444.0, 0.09168928335656129, 0.024534046523142373, 0.052291544414288856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1621.0, 1363, 1761, 1620.0, 1761.0, 1761.0, 1761.0, 0.02612343847146537, 23.505915856731225, 0.014873012332875302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 203.6, 143, 429, 149.0, 429.0, 429.0, 429.0, 0.026345323968448842, 0.046618874053544236, 0.014587694033311028], "isController": false}, {"data": ["addBook", 56, 8, 14.285714285714286, 1507.4107142857147, 759, 3817, 1170.0, 2712.4000000000015, 3013.2, 3817.0, 0.24266270317584812, 78.7084754959419, 0.8814761624518467], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b580144d-1b5d-47d0-9516-89f78e32fb33", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 151.88888888888889, 150, 158, 151.0, 158.0, 158.0, 158.0, 0.044361636057137784, 0.032967973671369, 0.022267461848992993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 248.33333333333334, 147, 449, 150.0, 449.0, 449.0, 449.0, 0.04436207338472761, 0.03408023866795481, 0.02405833797492064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 644.6666666666666, 145, 1630, 153.0, 1630.0, 1630.0, 1630.0, 0.04436185471985489, 13.313596223019365, 0.024809136200752178], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 294.54901960784326, 144, 617, 152.0, 596.8, 606.4, 617.0, 0.24555591934210272, 0.18248833458919939, 0.11870134772884848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 425.33333333333337, 144, 1177, 149.0, 1177.0, 1177.0, 1177.0, 0.04436229205175601, 4.355966959334566, 0.024852703327171904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba28ed34-4ac9-4b3b-9824-e3247fe2d987", 3, 0, 0.0, 401.3333333333333, 309, 527, 368.0, 527.0, 527.0, 527.0, 0.019436723745845402, 0.022973549453504116, 0.012464305266704244], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 944.4705882352939, 702, 1333, 882.0, 1194.0, 1320.0, 1333.0, 0.24544955770952245, 72.17031965894543, 0.12344386935586335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 147.6, 143, 150, 149.0, 150.0, 150.0, 150.0, 0.026345323968448842, 0.01957889798827106, 0.014793516876814534], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 222.33333333333337, 143, 596, 151.0, 450.0, 457.2, 596.0, 0.24613068091328963, 0.43553593145984454, 0.11970027255353342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 822.0999999999999, 148, 2080, 291.0, 1828.6000000000001, 2067.7999999999997, 2080.0, 0.09426892095079634, 38.18447798143138, 0.05177425892844518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 168.86666666666667, 143, 439, 149.0, 271.6000000000001, 439.0, 439.0, 0.09168816244697368, 0.02471282503453587, 0.05390261112605288], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1508.843137254902, 1025, 2124, 1562.0, 1767.2, 1970.3999999999999, 2124.0, 0.24473343250635826, 220.21157276470802, 0.12284471123854313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 626.1, 144, 1371, 442.0, 1313.2000000000003, 1368.85, 1371.0, 0.09426892095079634, 12.487161383090042, 0.05186631842156119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 154.61111111111114, 146, 169, 153.0, 160.9, 169.0, 169.0, 0.09899737656952091, 0.07395800105047216, 0.035190473702446885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 168.4, 142, 440, 148.0, 272.0000000000001, 440.0, 440.0, 0.0916898438216327, 0.024713278217549435, 0.053993140453559095], "isController": false}, {"data": ["deleteBooks", 11, 2, 18.181818181818183, 726.909090909091, 156, 1423, 510.0, 1377.2000000000003, 1423.0, 1423.0, 0.11459527034066049, 0.02308386615793312, 0.07752272372122096], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba28ed34-4ac9-4b3b-9824-e3247fe2d987", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, 4.9079754601226995, 237.68098159509208, 144, 2024, 156.0, 400.1999999999998, 500.39999999999895, 1609.9199999999905, 0.6836474057048908, 1.4598816212614343, 0.329826942575715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 160.8, 151, 198, 154.0, 195.5, 198.0, 198.0, 0.049538303015891884, 0.03836315848789284, 0.017609318650180318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 797.5555555555555, 299, 1782, 308.0, 1782.0, 1782.0, 1782.0, 0.04432864270621439, 17.72328976094548, 0.0959155234597028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=431b4959-1921-4158-a671-6078b0d81d3e", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 154.5, 145, 171, 152.0, 170.3, 171.0, 171.0, 0.10743085817112394, 0.08718265931660546, 0.03818831286551671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 808.4500000000002, 238, 1943, 734.5, 1536.1000000000008, 1924.5499999999997, 1943.0, 0.09150009836260574, 0.05620465026374903, 0.04137162650574849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 165.09999999999997, 147, 442, 150.0, 160.70000000000002, 427.9499999999998, 442.0, 0.0942644778454911, 0.0700539723050964, 0.047316349231037516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 250.95000000000002, 144, 450, 149.5, 446.9, 449.85, 450.0, 0.09426892095079634, 0.08893867629937924, 0.05020004159616137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ebfaf59-1f4d-4e63-b623-15108cfa6936", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["login", 20, 0, 0.0, 3326.4500000000003, 1983, 6891, 3113.0, 5615.100000000003, 6834.15, 6891.0, 0.0916447482976988, 27.535420874210708, 0.1762639958714041], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd35e516-61f0-4232-8a5e-b9f94f1f920f", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 391.2, 298, 869, 302.0, 841.2, 869.0, 869.0, 0.048592753848546104, 0.07530927769301042, 0.10928624229804851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce76a6b8-5b0f-4540-a4d5-869e212abcc2", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.15723591166231504, 0.6000462358572671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/519d6ac1-ea34-4d64-b207-6ee755f1c790", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 152.46666666666667, 147, 164, 152.0, 159.2, 164.0, 164.0, 0.09594841813041309, 0.07767699084971919, 0.03410666425729528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ebfaf59-1f4d-4e63-b623-15108cfa6936", 3, 0, 0.0, 410.3333333333333, 315, 466, 450.0, 466.0, 466.0, 466.0, 0.02227402996599498, 0.02233928591316098, 0.014283801768557978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 515.3846153846154, 297, 1477, 301.0, 1301.7999999999997, 1477.0, 1477.0, 0.10295072619858403, 9.621500170264662, 0.22951237240049416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce76a6b8-5b0f-4540-a4d5-869e212abcc2", 3, 0, 0.0, 406.33333333333337, 248, 701, 270.0, 701.0, 701.0, 701.0, 0.0365261222651066, 0.030450325234680338, 0.02342332710360026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 188.66666666666666, 150, 430, 154.0, 430.0, 430.0, 430.0, 0.045803857702682076, 0.03797604998982136, 0.016281840042750267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d693535-a5c9-45ae-a713-ad821723bd4a", 1, 0, 0.0, 1423.0, 1423, 1423, 1423.0, 1423.0, 1423.0, 1423.0, 0.7027406886858749, 0.12695998770203795, 0.4845067638791286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1004.1999999999998, 298, 2232, 738.5, 1978.6000000000001, 2219.7, 2232.0, 0.0941978814896453, 50.79233020979046, 0.20100760824514058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4284ad6-6f72-4f4d-8bdf-98b23fbfd8a3", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ece59dcc-44c3-417d-91bf-89eaf286ace5", 3, 0, 0.0, 550.3333333333334, 292, 1003, 356.0, 1003.0, 1003.0, 1003.0, 0.022512212875484952, 0.02660867348661649, 0.014436542761948357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 171.3, 145, 445, 153.5, 183.90000000000003, 431.99999999999983, 445.0, 0.09115936480154607, 0.07077313966526282, 0.03240430545679958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d693535-a5c9-45ae-a713-ad821723bd4a", 3, 0, 0.0, 352.6666666666667, 242, 456, 360.0, 456.0, 456.0, 456.0, 0.02391257562352041, 0.028263854846680536, 0.015334561841905993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ece59dcc-44c3-417d-91bf-89eaf286ace5", 1, 0, 0.0, 1194.0, 1194, 1194, 1194.0, 1194.0, 1194.0, 1194.0, 0.8375209380234506, 0.1513099350921273, 0.5774314279731994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 1049.111111111111, 148, 1911, 1513.0, 1911.0, 1911.0, 1911.0, 0.046985366668580886, 31.23382838725339, 0.07269578378117349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 554.1874999999999, 295, 892, 591.5, 892.0, 892.0, 892.0, 0.10834236186348863, 0.1679095002708559, 0.24366451110509207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7499515-e4aa-4e28-bb55-2a00efa25297", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28c5118e-6cd0-44e2-82fb-7083b11e58fb", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd35e516-61f0-4232-8a5e-b9f94f1f920f", 3, 0, 0.0, 417.3333333333333, 250, 529, 473.0, 529.0, 529.0, 529.0, 0.024689122795467075, 0.024761454209906924, 0.015832542938499394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 165.05555555555554, 143, 429, 149.0, 191.40000000000038, 429.0, 429.0, 0.10322521447905675, 0.07671326974468963, 0.05181421898655778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 245.33333333333337, 141, 447, 149.5, 446.1, 447.0, 447.0, 0.10322225471811723, 0.044846127158348674, 0.05790571363852713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 463.55555555555554, 148, 1755, 428.0, 1620.9000000000003, 1755.0, 1755.0, 0.10322284665672668, 10.344741459026265, 0.059698109014795275], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1240.1904761904761, 159, 2364, 1312.0, 2251.4, 2358.7, 2364.0, 0.09052075296024414, 0.028439276739183846, 0.04084041783948515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 309.16666666666663, 143, 1183, 149.0, 914.8000000000004, 1183.0, 1183.0, 0.10322403055431303, 3.3970965732489193, 0.059799598429847806], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4979253112033195], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.16597510373443983], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.16597510373443983], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.995850622406639], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1205, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
