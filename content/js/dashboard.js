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

    var data = {"OkPercent": 98.06114839671886, "KoPercent": 1.9388516032811334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8020565552699229, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a4f21d5-a130-4bc9-82e3-6131caf317ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/997e4834-e5b4-4ea8-94aa-4768af9e595c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=533e60d5-3c0f-40a2-a728-dd0e6c2448d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5684cbf5-14ce-412b-827b-85edd80b0322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b478b4f-a21b-4560-baf5-6198a5fabe1e"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b3267a5-7ce8-469a-8ad1-2c16800b74dc"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5dcc2fca-8031-4d70-bf98-d2739187c9e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ba6e7f3-8c44-4a29-b5c5-17adf22f7d90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5881d8cb-8b0d-4f26-94ec-d09bc92da37d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7016d62c-7e7c-47e1-8b04-ac3c707951d3"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c43d4f2-d98f-4691-8e91-c92033291370"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c19858f1-3424-4fd2-995d-324684bee4e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a77e4da-5934-4a4e-8f11-5f5a2efe3b20"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a4f21d5-a130-4bc9-82e3-6131caf317ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=997e4834-e5b4-4ea8-94aa-4768af9e595c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7016d62c-7e7c-47e1-8b04-ac3c707951d3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/533e60d5-3c0f-40a2-a728-dd0e6c2448d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5684cbf5-14ce-412b-827b-85edd80b0322"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5175438596491229, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b3267a5-7ce8-469a-8ad1-2c16800b74dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b478b4f-a21b-4560-baf5-6198a5fabe1e"], "isController": false}, {"data": [0.9357541899441341, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a84698f2-59ef-43f2-a556-7e8799f54a61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c19858f1-3424-4fd2-995d-324684bee4e6"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/078d68c8-3e8a-4b17-a1f0-f0b53cb5896f"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a77e4da-5934-4a4e-8f11-5f5a2efe3b20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5881d8cb-8b0d-4f26-94ec-d09bc92da37d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dcc2fca-8031-4d70-bf98-d2739187c9e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 26, 1.9388516032811334, 313.29903057419875, 100, 2056, 112.0, 813.0, 977.7999999999997, 1320.1599999999999, 5.389503128805507, 763.2095270130759, 3.947130948649007], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1497.5614035087717, 1213, 2204, 1452.0, 1755.0, 1829.6999999999998, 2204.0, 0.25697785031265635, 309.23191958650233, 1.2635580823478758], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 402.38461538461536, 105, 537, 423.0, 535.8, 537.0, 537.0, 0.07817855983065321, 0.015498288716428322, 0.05256145661691303], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 402.38461538461536, 105, 537, 423.0, 535.8, 537.0, 537.0, 0.07691397467755295, 0.015247594589397704, 0.051711243491894446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a4f21d5-a130-4bc9-82e3-6131caf317ca", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 127.83333333333334, 100, 305, 102.5, 303.5, 305.0, 305.0, 0.12257843743136886, 0.048141564049787276, 0.06905012564289836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/997e4834-e5b4-4ea8-94aa-4768af9e595c", 3, 0, 0.0, 491.6666666666667, 194, 862, 419.0, 862.0, 862.0, 862.0, 0.02468302877218387, 0.02475534233303988, 0.015828634987370516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 103.75, 101, 114, 103.5, 107.0, 112.75, 114.0, 0.12257718532138207, 0.09109495901325367, 0.06152800122577186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 169.74999999999997, 101, 501, 103.0, 402.5, 500.5, 501.0, 0.12257593323697503, 3.033734397105165, 0.07130312262189921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 185.87499999999997, 101, 906, 102.0, 604.0, 905.0, 906.0, 0.12257906349595488, 9.221690381246425, 0.0711852373947863], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 245.85714285714283, 101, 862, 193.5, 589.0, 862.0, 862.0, 0.07819962129040546, 0.15649197371654872, 0.05054392374978355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=533e60d5-3c0f-40a2-a728-dd0e6c2448d3", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5684cbf5-14ce-412b-827b-85edd80b0322", 3, 0, 0.0, 254.0, 190, 379, 193.0, 379.0, 379.0, 379.0, 0.023209574723225823, 0.027432931582041978, 0.014883744207276974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.94444444444446, 102, 309, 103.0, 303.6, 309.0, 309.0, 0.09921673896627183, 0.07373431479817662, 0.049802152176429415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 125.99999999999997, 100, 308, 103.0, 302.6, 308.0, 308.0, 0.0992172858560247, 0.03482724823613714, 0.056121930465218836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 659.5714285714287, 504, 708, 701.0, 708.0, 708.0, 708.0, 0.04415818724333053, 12.983973239349993, 0.025183966162211947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 821.0, 699, 912, 903.0, 912.0, 912.0, 912.0, 0.044099488445934025, 39.68079722228347, 0.025107423597636267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 219.14285714285717, 102, 309, 305.0, 309.0, 309.0, 309.0, 0.04432567976596041, 0.07843567552335963, 0.02454361369853472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 121.33333333333333, 102, 307, 103.0, 248.8000000000002, 307.0, 307.0, 0.06438389973280681, 0.04784780048502538, 0.03231769967056904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 119.08333333333334, 101, 306, 102.0, 245.4000000000002, 306.0, 306.0, 0.06438424517520563, 0.025286325456994007, 0.036268533943910594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 221.91666666666666, 102, 933, 103.5, 744.0000000000007, 933.0, 933.0, 0.06431591979804802, 4.8385220285375095, 0.03735013050772059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 221.08333333333331, 101, 718, 105.0, 594.4000000000004, 718.0, 718.0, 0.0643148856802907, 1.5917829526696037, 0.03741233747092431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 132.71428571428572, 100, 306, 105.0, 306.0, 306.0, 306.0, 0.044325399086896776, 0.032941043657352, 0.02488975046383364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b478b4f-a21b-4560-baf5-6198a5fabe1e", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 458.7619047619049, 101, 930, 301.0, 912.0, 928.1999999999999, 930.0, 0.11870241305048244, 45.79341368532838, 0.06541218353088805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 182.05555555555557, 101, 911, 103.0, 374.6000000000008, 911.0, 911.0, 0.09921673896627183, 4.985000573596772, 0.05785489965329262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 309.95238095238096, 101, 719, 104.0, 709.8, 718.1, 719.0, 0.11883675790688858, 14.993425515525175, 0.0656022671648379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 136.83333333333334, 100, 506, 103.0, 322.4000000000003, 506.0, 506.0, 0.0992178327518066, 1.6459975767422375, 0.0579524298722846], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 411.69230769230774, 108, 738, 387.0, 686.8, 738.0, 738.0, 0.07699004459500276, 0.015262674856235897, 0.05223663482437386], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2b3267a5-7ce8-469a-8ad1-2c16800b74dc", 3, 0, 0.0, 347.0, 194, 626, 221.0, 626.0, 626.0, 626.0, 0.05487871803314675, 0.03528172790216954, 0.03519240707203747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 361.4166666666667, 206, 1037, 210.5, 908.9000000000004, 1037.0, 1037.0, 0.06427905681197305, 6.499659898506048, 0.14319457203539632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 413.72727272727263, 129, 875, 353.0, 771.6, 860.2999999999997, 875.0, 0.10686615014694095, 0.0656433676195565, 0.04831936281057975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 113.28571428571429, 102, 303, 104.0, 106.6, 283.39999999999975, 303.0, 0.11883406802967457, 0.08831320876033431, 0.059649131803957735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dcc2fca-8031-4d70-bf98-d2739187c9e3", 3, 0, 0.0, 504.0, 197, 873, 442.0, 873.0, 873.0, 873.0, 0.021146417796825218, 0.024994349941494912, 0.01356069110017763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ba6e7f3-8c44-4a29-b5c5-17adf22f7d90", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 195.38095238095235, 102, 415, 104.0, 317.40000000000003, 405.4999999999999, 415.0, 0.11870241305048244, 0.10817022349968627, 0.06342497795526614], "isController": false}, {"data": ["login", 22, 0, 0.0, 1970.1818181818182, 1279, 3151, 1862.0, 2723.7, 3098.1999999999994, 3151.0, 0.1079924208955517, 41.25371358170363, 0.2199156738727064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 118.94444444444443, 104, 317, 105.5, 136.10000000000028, 317.0, 317.0, 0.09940083386255073, 0.08047196413286578, 0.03533389016207858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5881d8cb-8b0d-4f26-94ec-d09bc92da37d", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7016d62c-7e7c-47e1-8b04-ac3c707951d3", 3, 0, 0.0, 394.33333333333337, 218, 682, 283.0, 682.0, 682.0, 682.0, 0.024122348551855008, 0.024051677608831996, 0.015469084195037229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 573.3333333333334, 207, 1035, 410.0, 1016.8, 1033.2, 1035.0, 0.11863133335969586, 60.92976777916495, 0.25379624680119084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c43d4f2-d98f-4691-8e91-c92033291370", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c19858f1-3424-4fd2-995d-324684bee4e6", 3, 0, 0.0, 657.6666666666667, 179, 1489, 305.0, 1489.0, 1489.0, 1489.0, 0.037726832580892614, 0.03145130802072461, 0.02419331386209585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a77e4da-5934-4a4e-8f11-5f5a2efe3b20", 3, 0, 0.0, 316.6666666666667, 192, 381, 377.0, 381.0, 381.0, 381.0, 0.08502196400736857, 0.038470224599688255, 0.05452254853337113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 316.62500000000006, 204, 1008, 210.0, 706.5, 1006.75, 1008.0, 0.1225096093474832, 12.387717470508365, 0.27291488006819703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 644.8181818181819, 101, 1217, 810.0, 1177.2, 1217.0, 1217.0, 0.06925382155178927, 52.73051390270467, 0.11606040389143518], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 897.9999999999999, 248, 2056, 902.5, 1217.2, 1931.7999999999984, 2056.0, 0.10715451193555144, 0.033542863022439126, 0.048345102064672615], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a4f21d5-a130-4bc9-82e3-6131caf317ca", 3, 0, 0.0, 310.0, 188, 547, 195.0, 547.0, 547.0, 547.0, 0.0427240878407246, 0.02746747183770543, 0.027397933934318833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 105.84615384615384, 103, 109, 106.0, 109.0, 109.0, 109.0, 0.06379334880730975, 0.04952706279473754, 0.022676541958848384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 320.38888888888886, 205, 1220, 209.0, 670.1000000000008, 1220.0, 1220.0, 0.09916044159449991, 6.735717238147573, 0.22160465007381944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=997e4834-e5b4-4ea8-94aa-4768af9e595c", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 328.2666666666666, 204, 815, 210.0, 576.2000000000002, 815.0, 815.0, 0.0984671940131946, 7.995831042603472, 0.21977544351265302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 103.25, 101, 106, 103.5, 106.0, 106.0, 106.0, 0.07185843887541543, 0.05340260935956166, 0.036069567951136264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 152.75000000000003, 100, 309, 102.0, 309.0, 309.0, 309.0, 0.07185843887541543, 0.03271874719302973, 0.04022739266145693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 252.62500000000003, 100, 909, 102.5, 909.0, 909.0, 909.0, 0.07185843887541543, 8.099240784716608, 0.04147298571813528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 108.5, 108, 109, 108.5, 109.0, 109.0, 109.0, 0.038045235785348776, 0.01122037227263216, 0.023518197511841577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 225.75, 100, 700, 102.0, 700.0, 700.0, 700.0, 0.07185972980741592, 2.658090703821141, 0.04154390629491233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7016d62c-7e7c-47e1-8b04-ac3c707951d3", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 992.9649122807019, 799, 1766, 816.0, 1333.2, 1414.1, 1766.0, 0.25302408167794915, 302.7047670902231, 0.49962372378204417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 897.9999999999999, 248, 2056, 902.5, 1217.2, 1931.7999999999984, 2056.0, 0.10852460795485376, 0.033971747838140484, 0.04896325085463129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.14285714285714, 102, 309, 103.0, 309.0, 309.0, 309.0, 0.03118526273583855, 0.008405402846768984, 0.018363977958701802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 101.85714285714285, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.03118526273583855, 0.008405402846768984, 0.018333523600561334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 117.61538461538463, 100, 304, 102.0, 224.39999999999992, 304.0, 304.0, 0.06317088696784602, 0.01702652812805225, 0.03713757222133135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 197.15384615384613, 102, 413, 104.0, 411.8, 413.0, 413.0, 0.06323326264178843, 0.017043340321419537, 0.03723599352831877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.28571428571428, 100, 309, 102.0, 309.0, 309.0, 309.0, 0.031185401667973487, 0.008344531305688217, 0.017785424388766128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 103.15384615384615, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.0632317248155336, 0.04699154549279402, 0.03173936187029714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.85714285714286, 101, 306, 103.0, 306.0, 306.0, 306.0, 0.031183734564051394, 0.0231746308625421, 0.01565277301359611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 173.69230769230768, 101, 410, 103.0, 371.99999999999994, 410.0, 410.0, 0.06317058000310993, 0.01690306535239465, 0.036026971408023634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 108.71428571428571, 104, 126, 105.0, 126.0, 126.0, 126.0, 0.031633413923221186, 0.024898956662222926, 0.01124469010552003], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 543.6153846153845, 102, 1489, 442.0, 1291.7999999999997, 1489.0, 1489.0, 0.0766342248448157, 0.014869756818972277, 0.0521506492539953], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/533e60d5-3c0f-40a2-a728-dd0e6c2448d3", 3, 0, 0.0, 328.0, 207, 533, 244.0, 533.0, 533.0, 533.0, 0.026847319295168377, 0.03173262251326705, 0.0172165426469667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1045.0, 708, 1437, 1007.5, 1360.5, 1429.8, 1437.0, 0.10581756090522114, 0.05476885476539766, 0.04867194451792886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 265.8571428571429, 204, 615, 207.0, 615.0, 615.0, 615.0, 0.031169432582743715, 0.04830653272345144, 0.07010078441216676], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 952.4754098360654, 522, 2127, 828.0, 1545.6000000000001, 1626.5, 2127.0, 0.29514367690960375, 88.01708544711848, 1.0730568674732315], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5684cbf5-14ce-412b-827b-85edd80b0322", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 199.140350877193, 102, 709, 104.0, 414.2, 416.59999999999997, 709.0, 0.2538161480505139, 0.18862703971332134, 0.12269432937988707], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 584.5263157894734, 499, 825, 508.0, 803.0, 818.6999999999999, 825.0, 0.2540820283769507, 74.70855266017197, 0.12778539513098597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b3267a5-7ce8-469a-8ad1-2c16800b74dc", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 145.64912280701753, 100, 425, 105.0, 306.2, 310.1, 425.0, 0.25453814723022306, 0.45041320584098066, 0.12378905988344832], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 790.4912280701756, 696, 1305, 709.0, 916.2, 1026.1, 1305.0, 0.25385797314449865, 228.42185047013828, 0.12742480292604716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 133.86666666666667, 102, 312, 107.0, 309.6, 312.0, 312.0, 0.09792976477270501, 0.07316041997179623, 0.034810971071547486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b478b4f-a21b-4560-baf5-6198a5fabe1e", 3, 0, 0.0, 562.6666666666666, 316, 996, 376.0, 996.0, 996.0, 996.0, 0.021046576072849214, 0.02901440418897019, 0.013496664994633123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, 6.145251396648045, 163.8379888268156, 101, 1292, 108.0, 305.0, 342.0, 632.7999999999906, 0.7316634511624865, 1.601236297915781, 0.35153344039191003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 109.375, 103, 135, 106.0, 135.0, 135.0, 135.0, 0.06932409012131717, 0.05368555025996533, 0.02464254766031196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 116.83333333333333, 103, 307, 106.5, 129.0, 263.5, 307.0, 0.12580396597002722, 0.1020928669151295, 0.044719378528408106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a84698f2-59ef-43f2-a556-7e8799f54a61", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.7567202310426541, 1.4139329087677726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c19858f1-3424-4fd2-995d-324684bee4e6", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 382.875, 204, 1015, 307.5, 1015.0, 1015.0, 1015.0, 0.07179201852234077, 10.833382293059506, 0.1591658496585392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/078d68c8-3e8a-4b17-a1f0-f0b53cb5896f", 2, 0, 0.0, 192.0, 184, 200, 192.0, 200.0, 200.0, 200.0, 0.019884273528066654, 0.02831178789445428, 0.012359707129506275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 340.9230769230769, 205, 516, 404.0, 515.2, 516.0, 516.0, 0.06313805865039972, 0.0978516592560394, 0.14199897370299858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a77e4da-5934-4a4e-8f11-5f5a2efe3b20", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5881d8cb-8b0d-4f26-94ec-d09bc92da37d", 3, 0, 0.0, 258.0, 182, 372, 220.0, 372.0, 372.0, 372.0, 0.05089144854026362, 0.033314681970856165, 0.03263546667458311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 107.33333333333333, 103, 119, 106.0, 116.60000000000001, 119.0, 119.0, 0.06429145459416019, 0.053304145459416016, 0.02285360300026788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dcc2fca-8031-4d70-bf98-d2739187c9e3", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 107.61904761904762, 103, 127, 106.0, 118.6, 126.19999999999999, 127.0, 0.12176171811582438, 0.09453180263875038, 0.04328248573648445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 103.53333333333333, 101, 112, 103.0, 108.4, 112.0, 112.0, 0.09853446407104992, 0.07322727261530175, 0.04945968216066373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 169.66666666666663, 101, 308, 103.0, 306.8, 308.0, 308.0, 0.09853640591743963, 0.03623265759255853, 0.05564484276874162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 169.06666666666666, 101, 700, 102.0, 464.20000000000016, 700.0, 700.0, 0.09853770052422056, 5.935748133121149, 0.05736485143799351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 182.86666666666667, 101, 712, 103.0, 467.20000000000016, 712.0, 712.0, 0.09853770052422056, 1.9563454378686953, 0.05746107966116169], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5219985085756897], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.14914243102162567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14914243102162567], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1185682326621924], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
