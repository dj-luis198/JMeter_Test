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

    var data = {"OkPercent": 98.61431870669746, "KoPercent": 1.3856812933025404};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7643944407677035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d18855d0-d874-4257-bab0-11a983f28f9a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28bb2bd8-ab28-4c20-8ecd-766e1f6d89aa"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f190546b-6f5f-49cc-a02c-66a8e4933db6"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19f2ba47-350f-4201-99f2-2047b79c3c76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf4e5324-abeb-44a0-add8-a5093cef952e"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45ffad25-f624-43bd-b1a7-764bf51c4558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e2f860c1-03c2-47ae-b850-add972bbd11b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ded33f9d-22fa-468d-b5ba-5bd4b9007c34"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2f860c1-03c2-47ae-b850-add972bbd11b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b1d6d95-1579-41ec-a295-d72e70c7100a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10d19d5b-d92c-4d38-9581-924e9c7a78fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d1af494-a47a-481e-8e73-4b7fa627f62d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/96a7b99a-a6e1-41ee-9d1a-2583229e71b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72f1cfa1-90bc-40af-9937-9840f2885044"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19f2ba47-350f-4201-99f2-2047b79c3c76"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bf4e5324-abeb-44a0-add8-a5093cef952e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d18855d0-d874-4257-bab0-11a983f28f9a"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72f1cfa1-90bc-40af-9937-9840f2885044"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e60c8d0-8348-4605-abda-df66a407dae2"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28bb2bd8-ab28-4c20-8ecd-766e1f6d89aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ded33f9d-22fa-468d-b5ba-5bd4b9007c34"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45ffad25-f624-43bd-b1a7-764bf51c4558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9460227272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c752cac1-660e-40ff-9b6b-0b4053958b8e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96a7b99a-a6e1-41ee-9d1a-2583229e71b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b1d6d95-1579-41ec-a295-d72e70c7100a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d1af494-a47a-481e-8e73-4b7fa627f62d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10d19d5b-d92c-4d38-9581-924e9c7a78fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 18, 1.3856812933025404, 397.3725943033103, 100, 2795, 126.0, 1082.0, 1356.0, 2037.0, 5.0683782360170895, 703.4582265431436, 3.708095011363858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1811.62962962963, 1333, 2574, 1750.0, 2219.5, 2341.25, 2574.0, 0.2379535990481856, 286.33897354280964, 1.170015987507436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d18855d0-d874-4257-bab0-11a983f28f9a", 3, 0, 0.0, 396.3333333333333, 212, 548, 429.0, 548.0, 548.0, 548.0, 0.058251296091338035, 0.03744997063163822, 0.03735516057940623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28bb2bd8-ab28-4c20-8ecd-766e1f6d89aa", 3, 0, 0.0, 338.3333333333333, 215, 563, 237.0, 563.0, 563.0, 563.0, 0.02994520028348123, 0.02434022301687911, 0.019203139504706385], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 728.7142857142857, 110, 2484, 534.5, 1806.5, 2484.0, 2484.0, 0.0876413216311302, 0.016548901901190672, 0.059269155497614905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 728.7142857142857, 110, 2484, 534.5, 1806.5, 2484.0, 2484.0, 0.08599297314562296, 0.01623765194651237, 0.058154427639984275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 129.4090909090909, 103, 322, 109.5, 262.89999999999986, 321.09999999999997, 322.0, 0.09846704710753049, 0.039792435940472194, 0.05540519749356607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 120.86363636363636, 107, 311, 111.5, 118.8, 282.34999999999957, 311.0, 0.09846131812851887, 0.07317291317949498, 0.0494229663262292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f190546b-6f5f-49cc-a02c-66a8e4933db6", 2, 0, 0.0, 541.0, 395, 687, 541.0, 687.0, 687.0, 687.0, 0.02108659209041931, 0.030054571441374005, 0.013107046743703017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 188.4545454545454, 103, 861, 111.5, 687.9999999999995, 858.9, 861.0, 0.09846308082028697, 2.656073074151651, 0.057212434656319096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 213.63636363636365, 101, 1124, 110.0, 772.2999999999995, 1100.4499999999996, 1124.0, 0.09846616568275098, 8.078675095780724, 0.057118068765189524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19f2ba47-350f-4201-99f2-2047b79c3c76", 3, 0, 0.0, 313.0, 212, 502, 225.0, 502.0, 502.0, 502.0, 0.021831836639643706, 0.021895797098548914, 0.014000233782584018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf4e5324-abeb-44a0-add8-a5093cef952e", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 0.2577233416547789, 0.9835279957203995], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 288.1428571428571, 107, 566, 238.5, 489.0, 566.0, 566.0, 0.08818008893591826, 0.20455615497020774, 0.05700089872831715], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45ffad25-f624-43bd-b1a7-764bf51c4558", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 110.60000000000001, 102, 119, 111.0, 117.8, 119.0, 119.0, 0.116017356196487, 0.08621992975149083, 0.05823527449706476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 107.86666666666667, 100, 115, 109.0, 113.2, 115.0, 115.0, 0.11602094564805433, 0.031044667097233285, 0.06616819556490598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 747.5, 612, 882, 752.0, 882.0, 882.0, 882.0, 0.07399186089530152, 21.756063864224934, 0.042198483166851646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1099.3333333333333, 966, 1236, 1115.5, 1236.0, 1236.0, 1236.0, 0.07389617587289857, 66.4919089460558, 0.0420717485682616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 215.16666666666666, 107, 325, 214.5, 325.0, 325.0, 325.0, 0.0744841969362167, 0.1318021141097897, 0.041242714514487175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 185.6875, 104, 441, 113.0, 440.3, 441.0, 441.0, 0.08440554755461302, 0.06272716961822315, 0.042367628362374114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 162.875, 102, 329, 109.5, 326.9, 329.0, 329.0, 0.084408664549416, 0.0225859121938867, 0.04813931650083881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 136.25, 102, 328, 110.5, 325.9, 328.0, 328.0, 0.08441489922971404, 0.022752453308008864, 0.04962672786746861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 177.12500000000003, 102, 337, 112.0, 329.3, 337.0, 337.0, 0.08441044579266685, 0.022751252967554734, 0.04970654180954893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 111.5, 103, 116, 111.5, 116.0, 116.0, 116.0, 0.07468259895444362, 0.055501423637042566, 0.04193602968633308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 729.2352941176471, 104, 1301, 994.0, 1259.3999999999999, 1301.0, 1301.0, 0.09903008767075408, 52.42713597340751, 0.053212743570325925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 168.39999999999998, 106, 339, 109.0, 336.0, 339.0, 339.0, 0.11601645886829812, 0.03127006117934598, 0.06820498851437057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 533.5294117647059, 104, 993, 635.0, 971.4, 993.0, 993.0, 0.09903297215425842, 17.139803972969826, 0.053311005403122454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 152.4666666666667, 106, 339, 110.0, 327.0, 339.0, 339.0, 0.11601825353855674, 0.03127054489906412, 0.06831934265991182], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 601.9230769230769, 112, 1036, 571.0, 977.5999999999999, 1036.0, 1036.0, 0.08391807014259617, 0.01589854063248404, 0.05739738796937636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 379.1875, 212, 769, 232.5, 766.9, 769.0, 769.0, 0.08435125973334458, 0.13072797773126743, 0.18970796012294197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2f860c1-03c2-47ae-b850-add972bbd11b", 3, 0, 0.0, 746.0, 249, 1727, 262.0, 1727.0, 1727.0, 1727.0, 0.03161722084628761, 0.03191569070453707, 0.020275366232808133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ded33f9d-22fa-468d-b5ba-5bd4b9007c34", 3, 0, 0.0, 757.0, 243, 1556, 472.0, 1556.0, 1556.0, 1556.0, 0.027036770007209804, 0.027115979294340304, 0.01733803284967556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2f860c1-03c2-47ae-b850-add972bbd11b", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 746.0952380952381, 185, 1982, 607.0, 1654.4, 1950.4999999999995, 1982.0, 0.09116047281898569, 0.055996032620255855, 0.0412180653468656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 113.99999999999999, 105, 150, 112.0, 130.79999999999998, 150.0, 150.0, 0.09903066455401249, 0.07359603098203468, 0.049708751543713306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 192.1764705882353, 105, 426, 112.0, 357.19999999999993, 426.0, 426.0, 0.099031241443992, 0.11399287776049585, 0.051586356698880946], "isController": false}, {"data": ["login", 21, 0, 0.0, 3290.3333333333335, 1879, 5414, 3316.0, 4746.6, 5353.999999999999, 5414.0, 0.09214850829117174, 31.622930635210384, 0.18269007412469887], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 132.2, 108, 356, 116.0, 221.60000000000008, 356.0, 356.0, 0.11068640328222082, 0.08960842609468853, 0.03934555741672693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b1d6d95-1579-41ec-a295-d72e70c7100a", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10d19d5b-d92c-4d38-9581-924e9c7a78fe", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.1743861607142857, 0.6654952944015444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d1af494-a47a-481e-8e73-4b7fa627f62d", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96a7b99a-a6e1-41ee-9d1a-2583229e71b4", 3, 0, 0.0, 1014.3333333333334, 225, 2294, 524.0, 2294.0, 2294.0, 2294.0, 0.03184273932472164, 0.03193602860008704, 0.020419985829981002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72f1cfa1-90bc-40af-9937-9840f2885044", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19f2ba47-350f-4201-99f2-2047b79c3c76", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 845.8235294117648, 215, 1411, 1109.0, 1371.8, 1411.0, 1411.0, 0.0989655192487935, 69.70854768282425, 0.2076809158822194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 348.68181818181813, 218, 1435, 228.5, 883.4999999999995, 1381.2999999999993, 1435.0, 0.09841066771638045, 10.841685892159802, 0.21903887165459646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 934.875, 106, 1352, 1128.5, 1352.0, 1352.0, 1352.0, 0.09839372248050574, 88.29140646139277, 0.18269859773571448], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1300.409090909091, 292, 2340, 1263.5, 2237.1, 2324.7, 2340.0, 0.09103322712790168, 0.028496374187942236, 0.04107163177059627], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 151.50000000000003, 108, 446, 116.0, 350.60000000000014, 446.0, 446.0, 0.11094879713012445, 0.08613700558442279, 0.039438830229848926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 323.73333333333335, 215, 453, 230.0, 449.4, 453.0, 453.0, 0.11591873324008314, 0.17965139614454292, 0.2607039479022573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf4e5324-abeb-44a0-add8-a5093cef952e", 3, 0, 0.0, 594.3333333333334, 562, 655, 566.0, 655.0, 655.0, 655.0, 0.018387310304248696, 0.025348391646644926, 0.011791341568805314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 362.05555555555566, 215, 683, 361.5, 649.7, 683.0, 683.0, 0.08967448163167702, 0.1389779319819057, 0.20168001093530485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 111.33333333333333, 110, 113, 111.0, 113.0, 113.0, 113.0, 0.024602465167009736, 0.018283667961029697, 0.012349284273284184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 253.66666666666666, 107, 331, 323.0, 331.0, 331.0, 331.0, 0.02455835884673947, 0.018866447551531624, 0.013318432890191391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 463.6666666666667, 108, 1172, 111.0, 1172.0, 1172.0, 1172.0, 0.024390442198717062, 7.319903578992513, 0.013640227766079399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 307.33333333333337, 105, 704, 113.0, 704.0, 704.0, 704.0, 0.02448360006855408, 2.4040631809501267, 0.01371623558528046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d18855d0-d874-4257-bab0-11a983f28f9a", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1254.1111111111118, 852, 2082, 1117.0, 1750.0, 1884.5, 2082.0, 0.23880068986865963, 285.6886456352541, 0.4715380809711228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1300.409090909091, 292, 2340, 1263.5, 2237.1, 2324.7, 2340.0, 0.08730678413397622, 0.02732987578625712, 0.039390365497946306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 147.83333333333334, 108, 336, 110.5, 336.0, 336.0, 336.0, 0.030527981438987283, 0.008228244997227041, 0.017976926570028647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 144.5, 108, 317, 110.0, 317.0, 317.0, 317.0, 0.030563436960364315, 0.008237801368223194, 0.01796795805677668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 279.5555555555556, 102, 1333, 112.0, 1301.5, 1333.0, 1333.0, 0.10461953362936786, 10.484714014513054, 0.06050587177132495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72f1cfa1-90bc-40af-9937-9840f2885044", 3, 0, 0.0, 363.0, 222, 535, 332.0, 535.0, 535.0, 535.0, 0.030786597567858794, 0.02566551965211145, 0.019742707424701116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 240.44444444444443, 101, 871, 113.5, 659.5000000000003, 871.0, 871.0, 0.10461892556363446, 3.4430024832464414, 0.06060768702085985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 149.16666666666666, 109, 336, 113.0, 336.0, 336.0, 336.0, 0.030527981438987283, 0.00816862003347902, 0.017410489414422435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 138.83333333333331, 104, 326, 113.0, 322.4, 326.0, 326.0, 0.10461831750496937, 0.0777485738489079, 0.05251349140386158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.0, 109, 116, 111.5, 116.0, 116.0, 116.0, 0.0305631255889769, 0.02271341657540178, 0.01534125639915442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 135.55555555555554, 101, 343, 111.0, 318.70000000000005, 343.0, 343.0, 0.10462318217220977, 0.04545477662950607, 0.05869160718645014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 116.16666666666666, 109, 121, 117.0, 121.0, 121.0, 121.0, 0.02977519726068185, 0.023436336906357005, 0.010584152151258002], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 589.2307692307692, 106, 1727, 524.0, 1298.1999999999996, 1727.0, 1727.0, 0.08619203585588692, 0.016148057198361026, 0.05866134651850477], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1e60c8d0-8348-4605-abda-df66a407dae2", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1747.380952380952, 1207, 2795, 1611.0, 2253.8, 2740.899999999999, 2795.0, 0.09326701012613253, 0.04827296422543969, 0.042899181415437915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 296.16666666666663, 221, 446, 227.0, 446.0, 446.0, 446.0, 0.03051090510599997, 0.04728594375314644, 0.06861974068273236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28bb2bd8-ab28-4c20-8ecd-766e1f6d89aa", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ded33f9d-22fa-468d-b5ba-5bd4b9007c34", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.2029933286516854, 0.7746664325842697], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1136.2295081967213, 537, 2709, 904.0, 1936.4, 2157.7999999999997, 2709.0, 0.28174999076229534, 83.96097401780106, 1.0257280177271553], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/45ffad25-f624-43bd-b1a7-764bf51c4558", 3, 0, 0.0, 458.3333333333333, 394, 506, 475.0, 506.0, 506.0, 506.0, 0.02287910679967054, 0.0270423296841158, 0.014671823045361644], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 205.42592592592595, 108, 456, 115.0, 443.5, 448.25, 456.0, 0.24011632301870686, 0.17844582208714443, 0.11607185536548817], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 716.0925925925924, 522, 1013, 659.0, 972.5, 1007.5, 1013.0, 0.23996267247317085, 70.55699321772168, 0.12068435187859666], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 174.75925925925924, 103, 462, 113.5, 335.5, 343.0, 462.0, 0.2402744468125815, 0.42517314221132585, 0.11685222120377498], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1047.2962962962958, 738, 1661, 995.5, 1323.0, 1437.25, 1661.0, 0.23931820901343284, 215.33894514682615, 0.12012652288369578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 113.61111111111111, 107, 122, 113.5, 120.2, 122.0, 122.0, 0.08858616480963818, 0.06618009382751289, 0.031489613272176066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 187.73863636363637, 105, 2037, 118.0, 308.3000000000001, 397.60000000000014, 1799.839999999997, 0.7450996994200076, 1.5423742379662164, 0.36105236733203505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 116.66666666666667, 113, 119, 118.0, 119.0, 119.0, 119.0, 0.025568036545246902, 0.019800247051153116, 0.009088637990693234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 139.50000000000003, 106, 336, 117.0, 290.7999999999999, 335.7, 336.0, 0.09830249464921648, 0.07977477837255752, 0.03494346489483867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c752cac1-660e-40ff-9b6b-0b4053958b8e", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 646.3333333333333, 220, 1285, 434.0, 1285.0, 1285.0, 1285.0, 0.024368253039939565, 9.742811492271201, 0.052726490220207776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 458.2222222222222, 223, 1656, 259.0, 1436.4000000000003, 1656.0, 1656.0, 0.10454904511872125, 14.04147221028298, 0.23216104691347986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96a7b99a-a6e1-41ee-9d1a-2583229e71b4", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b1d6d95-1579-41ec-a295-d72e70c7100a", 3, 0, 0.0, 387.0, 277, 536, 348.0, 536.0, 536.0, 536.0, 0.01669226146758363, 0.023011629985422093, 0.010704347360397054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 116.1875, 110, 134, 114.5, 128.4, 134.0, 134.0, 0.088065476681913, 0.07301522431928138, 0.03130452491427376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d1af494-a47a-481e-8e73-4b7fa627f62d", 3, 0, 0.0, 784.3333333333334, 412, 1418, 523.0, 1418.0, 1418.0, 1418.0, 0.034081614105244025, 0.02191119396414614, 0.02185572258702172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 128.8235294117647, 109, 340, 117.0, 167.99999999999983, 340.0, 340.0, 0.09459263957978611, 0.07343862154875973, 0.0336247273506271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10d19d5b-d92c-4d38-9581-924e9c7a78fe", 3, 0, 0.0, 321.3333333333333, 234, 494, 236.0, 494.0, 494.0, 494.0, 0.026030368763557483, 0.02610662960954447, 0.016692651843817786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 140.05555555555557, 104, 347, 114.0, 329.90000000000003, 347.0, 347.0, 0.0898212557011547, 0.06675192928572142, 0.04508605999061867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 168.55555555555554, 104, 325, 112.5, 325.0, 325.0, 325.0, 0.08982304859426929, 0.02403468292463846, 0.0512272074014192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 194.5, 103, 336, 116.0, 335.1, 336.0, 336.0, 0.08973170221039094, 0.024185497861394428, 0.052752426494780603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 168.83333333333334, 105, 337, 112.5, 328.0, 337.0, 337.0, 0.08972633467922836, 0.024184051144010767, 0.05283689434724091], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5388760585065435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6928406466512702], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
