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

    var data = {"OkPercent": 99.01886792452831, "KoPercent": 0.9811320754716981};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8110749185667753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3898305084745763, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a5acf951-246e-4a1a-94ae-dd530fbde54b"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/430fb8ae-faca-45e0-b9e2-ed3c3f897f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fb6a3a0-ef98-4987-82d9-146e78a6c079"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b475d3fa-dba2-49a4-bb62-a06c6120ac54"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc1d68ad-c0bd-48c4-aba3-cd4471605c77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2da03515-4f98-43c9-a9c4-8e52ddf6afaf"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c099f70a-19db-425a-a3b9-baa2b1b9d12b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd63bea0-27bb-4be4-9d82-42cfe647a281"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7687dc45-5170-47e3-8532-4567c1a68e96"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beab68a8-6901-4eb0-8ffe-0ede659de334"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3eb8d7b-10e8-494d-8cee-0103d1d40864"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c393492-162f-4c13-968b-5da11da68c30"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c5e0d1a-eab1-43cd-bd13-09310311a6a5"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6f5ae89-ffb3-4c90-9571-827319f0c580"], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5acf951-246e-4a1a-94ae-dd530fbde54b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b475d3fa-dba2-49a4-bb62-a06c6120ac54"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0fb6a3a0-ef98-4987-82d9-146e78a6c079"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8050847457627118, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9485714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/201ae843-d19f-4e8b-8038-4fccb4c9ce8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=430fb8ae-faca-45e0-b9e2-ed3c3f897f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc1d68ad-c0bd-48c4-aba3-cd4471605c77"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c099f70a-19db-425a-a3b9-baa2b1b9d12b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c393492-162f-4c13-968b-5da11da68c30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7687dc45-5170-47e3-8532-4567c1a68e96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c5e0d1a-eab1-43cd-bd13-09310311a6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd63bea0-27bb-4be4-9d82-42cfe647a281"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6f5ae89-ffb3-4c90-9571-827319f0c580"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/beab68a8-6901-4eb0-8ffe-0ede659de334"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3eb8d7b-10e8-494d-8cee-0103d1d40864"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 13, 0.9811320754716981, 326.0467924528304, 77, 3862, 98.0, 918.0, 1101.4000000000005, 2086.300000000001, 5.320216823930937, 762.4470017315799, 3.8998898940975706], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1357.3050847457619, 969, 2071, 1355.0, 1664.0, 1758.0, 2071.0, 0.2665413771605663, 320.7379135556055, 1.3105818691439954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5acf951-246e-4a1a-94ae-dd530fbde54b", 3, 0, 0.0, 774.0, 332, 1566, 424.0, 1566.0, 1566.0, 1566.0, 0.03214400514304082, 0.026797134495874852, 0.020613180381442196], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 645.2307692307692, 453, 1002, 552.0, 987.2, 1002.0, 1002.0, 0.08263464680045005, 0.014929110994221933, 0.056165736497180895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 645.2307692307692, 453, 1002, 552.0, 987.2, 1002.0, 1002.0, 0.08499787505312367, 0.015356061410964727, 0.05777199320017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 114.64285714285712, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.1529753709652746, 0.05734442268187679, 0.08632608475928233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 84.85714285714286, 79, 100, 83.0, 95.5, 100.0, 100.0, 0.15297035653019525, 0.11368207160105331, 0.07678394849269567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 145.21428571428572, 78, 651, 82.5, 447.0, 651.0, 651.0, 0.1529753709652746, 3.2511321201840073, 0.08914315353263838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 186.5, 80, 883, 83.5, 575.5, 883.0, 883.0, 0.152972027972028, 9.870035665018575, 0.08899181872814686], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 344.92857142857144, 83, 1566, 222.5, 1021.0, 1566.0, 1566.0, 0.08697272783748525, 0.18160167655463752, 0.05622044286202398], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 103.06666666666666, 79, 242, 82.0, 238.4, 242.0, 242.0, 0.07934954532710528, 0.05896973046281945, 0.03982975224426964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 102.60000000000001, 78, 246, 82.0, 238.8, 246.0, 246.0, 0.07935248373274083, 0.029178569539226578, 0.04481142212876263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 595.6, 468, 638, 624.0, 638.0, 638.0, 638.0, 0.07797392551930635, 22.926923080671823, 0.044469504397729405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 785.6, 702, 849, 791.0, 849.0, 849.0, 849.0, 0.07777138324182234, 69.97882734850135, 0.044278043388654716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 208.6, 83, 243, 239.0, 243.0, 243.0, 243.0, 0.07844244677679986, 0.13880636089800913, 0.043434440744575704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 92.82352941176471, 80, 247, 83.0, 127.7999999999999, 247.0, 247.0, 0.07865345288658172, 0.058452419576844425, 0.039480346468459965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 101.41176470588235, 79, 248, 82.0, 244.0, 248.0, 248.0, 0.07865563637036625, 0.034945007564821495, 0.044081134445616565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 195.1764705882353, 79, 1002, 81.0, 958.0, 1002.0, 1002.0, 0.07865490852896814, 8.345038191006505, 0.04544525907538842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 165.23529411764707, 80, 638, 82.0, 498.7999999999999, 638.0, 638.0, 0.07865527244798341, 2.7395602476253047, 0.04552228113013746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/430fb8ae-faca-45e0-b9e2-ed3c3f897f2c", 3, 0, 0.0, 427.0, 217, 647, 417.0, 647.0, 647.0, 647.0, 0.02447660852112331, 0.024707670255209438, 0.01569626262585056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 148.0, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.07863860841118556, 0.05844138769620333, 0.04415742171526533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 148.79999999999998, 78, 932, 82.0, 513.8000000000002, 932.0, 932.0, 0.07935038484936652, 4.77993596589256, 0.046194735763218454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 550.3333333333334, 78, 1192, 683.5, 1083.1000000000001, 1192.0, 1192.0, 0.08706840674489924, 43.535044202332465, 0.0470297882786576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 128.13333333333335, 78, 463, 82.0, 330.4000000000001, 463.0, 463.0, 0.07935164416606712, 1.5754297718111219, 0.0462729607288713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 391.83333333333337, 79, 724, 467.5, 705.1, 724.0, 724.0, 0.08706798558541128, 14.233140403173143, 0.047114588120057074], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 812.9230769230769, 204, 1927, 617.0, 1718.9999999999998, 1927.0, 1927.0, 0.08507129629023708, 0.015369325989935413, 0.05865267107510487], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 310.47058823529414, 161, 1085, 168.0, 1041.8, 1085.0, 1085.0, 0.07862398771615815, 11.173589660540934, 0.17446052237546192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fb6a3a0-ef98-4987-82d9-146e78a6c079", 1, 0, 0.0, 1124.0, 1124, 1124, 1124.0, 1124.0, 1124.0, 1124.0, 0.889679715302491, 0.16073315169039146, 0.6133924599644127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 687.65, 128, 2111, 658.5, 1433.400000000001, 2079.2, 2111.0, 0.09925607571253454, 0.060968819944515855, 0.0448784795458042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 93.1111111111111, 78, 235, 82.0, 124.30000000000018, 235.0, 235.0, 0.08706840674489924, 0.06470611087194172, 0.04370425885437325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 143.05555555555557, 78, 250, 82.0, 241.9, 250.0, 250.0, 0.08706756442999768, 0.0959481536839254, 0.04559332312707995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b475d3fa-dba2-49a4-bb62-a06c6120ac54", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["login", 20, 0, 0.0, 3209.2000000000003, 1759, 5897, 3069.0, 4730.9000000000015, 5841.15, 5897.0, 0.10016527269995493, 30.09548274183653, 0.19265185994390746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 90.06666666666666, 83, 110, 86.0, 107.0, 110.0, 110.0, 0.07770772570208931, 0.06290986778030472, 0.027622668120664554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc1d68ad-c0bd-48c4-aba3-cd4471605c77", 1, 0, 0.0, 1216.0, 1216, 1216, 1216.0, 1216.0, 1216.0, 1216.0, 0.8223684210526315, 0.14857241981907895, 0.5669844777960527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2da03515-4f98-43c9-a9c4-8e52ddf6afaf", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 658.0, 161, 1278, 811.5, 1165.5000000000002, 1278.0, 1278.0, 0.08703346436704913, 57.90566055981858, 0.18336900798773795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c099f70a-19db-425a-a3b9-baa2b1b9d12b", 3, 0, 0.0, 455.0, 310, 601, 454.0, 601.0, 601.0, 601.0, 0.09969427090256545, 0.04510906137843945, 0.06393154742124153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd63bea0-27bb-4be4-9d82-42cfe647a281", 3, 0, 0.0, 449.0, 405, 490, 452.0, 490.0, 490.0, 490.0, 0.0475187302995264, 0.03082839501528519, 0.030472623271506183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7687dc45-5170-47e3-8532-4567c1a68e96", 1, 0, 0.0, 1927.0, 1927, 1927, 1927.0, 1927.0, 1927.0, 1927.0, 0.5189413596263622, 0.09375405422937208, 0.3577857420861443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 306.4285714285714, 161, 966, 323.0, 659.0, 966.0, 966.0, 0.15283175407187458, 13.279934469974018, 0.3409290942535261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 791.8333333333334, 83, 1052, 897.0, 1052.0, 1052.0, 1052.0, 0.06680919294494922, 66.60883060946686, 0.13272672673926597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beab68a8-6901-4eb0-8ffe-0ede659de334", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3eb8d7b-10e8-494d-8cee-0103d1d40864", 3, 0, 0.0, 371.3333333333333, 204, 585, 325.0, 585.0, 585.0, 585.0, 0.02267162419515734, 0.026797092269731867, 0.014538769422024726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c393492-162f-4c13-968b-5da11da68c30", 3, 0, 0.0, 874.6666666666667, 173, 1868, 583.0, 1868.0, 1868.0, 1868.0, 0.023754849948531158, 0.023824444235489746, 0.01523341614537968], "isController": false}, {"data": ["register", 20, 5, 25.0, 1333.7, 119, 2636, 1257.5, 2598.6000000000004, 2635.4, 2636.0, 0.10049342270548392, 0.0316986089197962, 0.04533980594720075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 110.33333333333336, 83, 360, 88.0, 226.80000000000007, 360.0, 360.0, 0.07352148297732597, 0.057079666959935695, 0.026134589652096342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 275.6666666666667, 162, 1168, 169.0, 760.6000000000003, 1168.0, 1168.0, 0.07931472081218273, 6.440592861014171, 0.17702777171901438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c5e0d1a-eab1-43cd-bd13-09310311a6a5", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 266.4545454545455, 159, 1105, 172.0, 333.0, 989.6499999999984, 1105.0, 0.11162696298551386, 6.235347970101732, 0.24975343760306465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 127.22222222222223, 81, 268, 84.0, 268.0, 268.0, 268.0, 0.06270466104647111, 0.04659985064098098, 0.03147480056434195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 121.66666666666667, 78, 252, 86.0, 252.0, 252.0, 252.0, 0.06277595262508108, 0.016797471698508027, 0.03580191048149156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 121.22222222222223, 79, 246, 84.0, 246.0, 246.0, 246.0, 0.06277507689946919, 0.016919844945560057, 0.036904879192852014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 103.44444444444444, 80, 244, 81.0, 244.0, 244.0, 244.0, 0.06277551475922102, 0.016919962962446293, 0.036966440820127226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6f5ae89-ffb3-4c90-9571-827319f0c580", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 0.17075998345935728, 0.651657017958412], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 947.3898305084746, 630, 1717, 934.0, 1310.0, 1418.0, 1717.0, 0.2685040230094295, 321.2241586210271, 0.5301905610596352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1333.7, 119, 2636, 1257.5, 2598.6000000000004, 2635.4, 2636.0, 0.10062083052433514, 0.031738797128281496, 0.04539728877172152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 104.14285714285714, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.04630456496861212, 0.012480527276696235, 0.027267238941477645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.42857142857143, 78, 91, 78.0, 91.0, 91.0, 91.0, 0.04630395237307756, 0.01248036216305606, 0.027221659500578796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 112.06666666666666, 78, 242, 80.0, 242.0, 242.0, 242.0, 0.07133651335657319, 0.01922741961563887, 0.04193806742251666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 117.86666666666667, 79, 323, 82.0, 273.20000000000005, 323.0, 323.0, 0.07133719188277872, 0.019227602499655203, 0.04200813154815974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5acf951-246e-4a1a-94ae-dd530fbde54b", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 91.93333333333334, 79, 236, 81.0, 147.80000000000007, 236.0, 236.0, 0.07139015672519074, 0.05305459889440444, 0.035834512262449256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.85714285714286, 79, 234, 83.0, 234.0, 234.0, 234.0, 0.04630517758035602, 0.012390252594743701, 0.026408421588796794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 111.86666666666666, 77, 244, 81.0, 239.8, 244.0, 244.0, 0.07139253519651986, 0.019103080706881288, 0.040716055229265226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 105.57142857142857, 79, 235, 85.0, 235.0, 235.0, 235.0, 0.04630364608138858, 0.034411205730406944, 0.023242259849447004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 84.71428571428572, 80, 94, 84.0, 94.0, 94.0, 94.0, 0.05037602101399734, 0.03965143841531431, 0.017907101219819366], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 870.8461538461539, 424, 2166, 638.0, 2046.8, 2166.0, 2166.0, 0.08536120924002259, 0.015421702841215017, 0.058102307461226306], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1925.0, 1219, 3862, 1709.0, 2799.6000000000004, 3809.5499999999993, 3862.0, 0.10068161453037061, 0.05211060127060198, 0.04630960980840289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 211.2857142857143, 159, 474, 168.0, 474.0, 474.0, 474.0, 0.04627579048966397, 0.07171843701864915, 0.10407533740009388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b475d3fa-dba2-49a4-bb62-a06c6120ac54", 3, 0, 0.0, 424.0, 273, 681, 318.0, 681.0, 681.0, 681.0, 0.03485292067475255, 0.029055445914075936, 0.022350343010827643], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 937.7068965517241, 420, 3269, 750.5, 1548.1, 1715.3999999999992, 3269.0, 0.2782788930257552, 87.17570332141452, 1.0118955605520477], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0fb6a3a0-ef98-4987-82d9-146e78a6c079", 3, 0, 0.0, 858.0, 196, 2166, 212.0, 2166.0, 2166.0, 2166.0, 0.01811922449719152, 0.024978813719272817, 0.011619424563628676], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 152.30508474576266, 79, 564, 84.0, 325.0, 332.0, 564.0, 0.26926622671303524, 0.20010898293810528, 0.130162873264602], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 508.96610169491527, 386, 738, 474.0, 651.0, 696.0, 738.0, 0.2695122285463698, 79.24554384084618, 0.13554570088025436], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 129.0, 78, 333, 84.0, 245.0, 248.0, 333.0, 0.2697179847037902, 0.4772744026203788, 0.13117144177977297], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 793.6271186440677, 545, 1250, 780.0, 1005.0, 1091.0, 1250.0, 0.26924287989485834, 242.26521660789336, 0.13514730494722382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 103.18181818181817, 83, 241, 86.0, 205.89999999999992, 241.0, 241.0, 0.11276152986642883, 0.08424079135529108, 0.04008320006970713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, 4.0, 161.6228571428571, 78, 2291, 91.0, 326.4000000000001, 392.2, 1311.3600000000117, 0.7311407466827099, 1.6134709549115946, 0.34934410799784416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 103.88888888888887, 83, 243, 85.0, 243.0, 243.0, 243.0, 0.05859375, 0.045375823974609375, 0.0208282470703125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/201ae843-d19f-4e8b-8038-4fccb4c9ce8c", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=430fb8ae-faca-45e0-b9e2-ed3c3f897f2c", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 103.71428571428572, 80, 249, 90.0, 188.0, 249.0, 249.0, 0.16164415194550283, 0.13117801783858676, 0.05745944463687796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc1d68ad-c0bd-48c4-aba3-cd4471605c77", 3, 0, 0.0, 752.0, 209, 1758, 289.0, 1758.0, 1758.0, 1758.0, 0.028927094080552315, 0.024115328105564608, 0.018550252388895853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 268.99999999999994, 164, 515, 168.0, 515.0, 515.0, 515.0, 0.0626688577556193, 0.09712448950992954, 0.1409437298937415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 232.80000000000004, 162, 479, 166.0, 433.40000000000003, 479.0, 479.0, 0.0713076879195269, 0.1105129889924699, 0.1603726614049516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c099f70a-19db-425a-a3b9-baa2b1b9d12b", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 88.94117647058825, 81, 127, 85.0, 103.79999999999998, 127.0, 127.0, 0.08155002614397897, 0.0676132540978888, 0.028988485855867524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c393492-162f-4c13-968b-5da11da68c30", 1, 0, 0.0, 1407.0, 1407, 1407, 1407.0, 1407.0, 1407.0, 1407.0, 0.7107320540156361, 0.12840374022743425, 0.4900164356787491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7687dc45-5170-47e3-8532-4567c1a68e96", 3, 0, 0.0, 394.0, 234, 476, 472.0, 476.0, 476.0, 476.0, 0.02387223579403035, 0.023942173984833174, 0.015308692875729099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 95.5, 81, 240, 86.5, 116.70000000000019, 240.0, 240.0, 0.08708989128278571, 0.06761373395489712, 0.030957734791927736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c5e0d1a-eab1-43cd-bd13-09310311a6a5", 3, 0, 0.0, 1133.0, 198, 2563, 638.0, 2563.0, 2563.0, 2563.0, 0.022066124820712733, 0.026081412507815083, 0.014150477179949246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd63bea0-27bb-4be4-9d82-42cfe647a281", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6f5ae89-ffb3-4c90-9571-827319f0c580", 3, 0, 0.0, 393.0, 195, 655, 329.0, 655.0, 655.0, 655.0, 0.03079860790292279, 0.02521435510281602, 0.019750409364830045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beab68a8-6901-4eb0-8ffe-0ede659de334", 3, 0, 0.0, 348.3333333333333, 228, 483, 334.0, 483.0, 483.0, 483.0, 0.052354193570905025, 0.0336587019213989, 0.033573490017800425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3eb8d7b-10e8-494d-8cee-0103d1d40864", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 83.36363636363636, 80, 94, 82.5, 90.89999999999999, 93.85, 94.0, 0.11167399315742987, 0.08299209843047278, 0.05605510984660054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 95.36363636363637, 77, 252, 80.5, 189.5999999999999, 249.29999999999995, 252.0, 0.11167399315742987, 0.037505567836874754, 0.06326276192627486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 159.6818181818182, 77, 1022, 82.0, 242.8, 905.2999999999984, 1022.0, 0.11167399315742987, 4.59620670887859, 0.06521586709779596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 143.0909090909091, 79, 642, 82.0, 249.2, 583.3499999999992, 642.0, 0.1116751269035533, 1.5212860881979695, 0.065325586928934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.37735849056603776], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5283018867924528], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 13, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
