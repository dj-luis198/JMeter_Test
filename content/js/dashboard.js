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

    var data = {"OkPercent": 98.2496194824962, "KoPercent": 1.7503805175038052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8005874673629243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3888888888888889, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/20e570da-d6dd-47fe-983d-4921ff54e96f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dc85268-d572-430b-a1b0-54cb711954dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20b66407-4062-4cb0-b767-feb298daf105"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18d641d1-81db-44c0-8a6e-5c8f983e0f4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d028c53-8bd3-4c72-aea3-9ed1d9497ca7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1169871-7287-4111-97f4-94c0d216781d"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e95fdb0-2b20-4bb0-901c-eb4dde51bfbc"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7644ea74-16ff-42bb-8a76-cc7658182710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3a8528f-5282-4b70-a19c-9bf41c86498b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/994cce86-301d-46e8-979d-cd4f2f4f9b25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3b7a437-f065-4cb1-ad64-2521f7d20ac4"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8ba3342-de9d-45cf-87e0-810a47fb5b67"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c527d8f0-136d-4fbd-862f-790f9f989fcc"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20b66407-4062-4cb0-b767-feb298daf105"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20e570da-d6dd-47fe-983d-4921ff54e96f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc85268-d572-430b-a1b0-54cb711954dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7644ea74-16ff-42bb-8a76-cc7658182710"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18d641d1-81db-44c0-8a6e-5c8f983e0f4f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d028c53-8bd3-4c72-aea3-9ed1d9497ca7"], "isController": false}, {"data": [0.3951612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1169871-7287-4111-97f4-94c0d216781d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97e15db3-df55-4abd-8ee4-d34b12f879b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3b7a437-f065-4cb1-ad64-2521f7d20ac4"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8ba3342-de9d-45cf-87e0-810a47fb5b67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e95fdb0-2b20-4bb0-901c-eb4dde51bfbc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994cce86-301d-46e8-979d-cd4f2f4f9b25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1e96ed8-f31d-4a51-8855-50748202dd23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db574468-b6b4-4eb3-8cd2-a6b7e66926b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c527d8f0-136d-4fbd-862f-790f9f989fcc"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 23, 1.7503805175038052, 315.76255707762647, 77, 2437, 94.5, 853.0, 1077.5, 1732.7999999999956, 5.110692782799446, 710.5775960697936, 3.7314427752637025], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1342.4074074074078, 1022, 1848, 1322.0, 1651.5, 1681.0, 1848.0, 0.2379682797096787, 286.3569578248047, 1.170088172205305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/20e570da-d6dd-47fe-983d-4921ff54e96f", 3, 0, 0.0, 710.0, 184, 1558, 388.0, 1558.0, 1558.0, 1558.0, 0.057597051030987216, 0.037029354097070234, 0.036935608896824484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc85268-d572-430b-a1b0-54cb711954dd", 3, 0, 0.0, 381.3333333333333, 311, 449, 384.0, 449.0, 449.0, 449.0, 0.03062693332516615, 0.030716660668892223, 0.01964031857115147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20b66407-4062-4cb0-b767-feb298daf105", 1, 0, 0.0, 871.0, 871, 871, 871.0, 871.0, 871.0, 871.0, 1.1481056257175661, 0.20742142652123996, 0.7915650114810563], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 571.0714285714286, 86, 1146, 498.0, 1071.5, 1146.0, 1146.0, 0.09299297903008323, 0.018318371427242956, 0.06257047124192124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 571.0714285714286, 86, 1146, 498.0, 1071.5, 1146.0, 1146.0, 0.09252099896244308, 0.01822539767507947, 0.062252898715940704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 110.19047619047619, 77, 242, 81.0, 239.4, 241.8, 242.0, 0.13887970372329872, 0.03716117072283579, 0.07920483102969379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 104.71428571428572, 79, 359, 82.0, 221.60000000000008, 347.99999999999983, 359.0, 0.1388778668359654, 0.10320903970915007, 0.0697101792516467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 129.85714285714286, 78, 319, 81.0, 244.8, 311.5999999999999, 319.0, 0.13887970372329872, 0.03743242014417036, 0.08178170053237219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 118.47619047619047, 78, 247, 81.0, 243.4, 246.7, 247.0, 0.13887878527355815, 0.037432172593263716, 0.08164553587371289], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 432.3571428571428, 80, 1558, 226.0, 1365.0, 1558.0, 1558.0, 0.09308696317080793, 0.19423202632033884, 0.06016628074363186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18d641d1-81db-44c0-8a6e-5c8f983e0f4f", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.25000000000001, 79, 241, 81.5, 129.60000000000008, 235.64999999999992, 241.0, 0.09868210054719224, 0.07333699073868487, 0.04953378875122736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 80.55, 78, 83, 80.5, 82.9, 83.0, 83.0, 0.098683074372499, 0.02640543200982883, 0.056280190853065834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 609.0, 470, 651, 632.0, 651.0, 651.0, 651.0, 0.05779344622319829, 16.993192112639427, 0.03296032479916777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 810.6666666666667, 690, 1006, 774.0, 1006.0, 1006.0, 1006.0, 0.057752837108122936, 51.966104348547994, 0.032880765658237956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 161.16666666666666, 79, 245, 162.0, 245.0, 245.0, 245.0, 0.05801080934747508, 0.10265193997814925, 0.03212121962892419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 82.28571428571429, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.06937080678248288, 0.05155389058737253, 0.03482089324823848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 91.99999999999999, 78, 238, 80.0, 162.0, 238.0, 238.0, 0.06937286926187268, 0.018562662282962022, 0.03956421450091176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 126.35714285714286, 79, 239, 83.0, 238.5, 239.0, 239.0, 0.06931859817989167, 0.018683528415673924, 0.04075175400810037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 114.35714285714285, 79, 237, 80.5, 236.0, 237.0, 237.0, 0.06931894140073774, 0.018683620924417596, 0.04081965006312975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 80.66666666666666, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.05810125111360732, 0.04317876181392106, 0.03262521424836348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d028c53-8bd3-4c72-aea3-9ed1d9497ca7", 3, 0, 0.0, 351.0, 184, 453, 416.0, 453.0, 453.0, 453.0, 0.017840788800742177, 0.02459496763383565, 0.011440870422350941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1169871-7287-4111-97f4-94c0d216781d", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 747.8461538461539, 79, 1147, 901.0, 1105.0, 1147.0, 1147.0, 0.07279935936563758, 50.39298310424868, 0.0379856032266916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 95.80000000000003, 78, 240, 80.0, 222.60000000000034, 239.9, 240.0, 0.09860425674576372, 0.026576928576006627, 0.0579685181259275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 496.4615384615385, 80, 668, 632.0, 658.4, 668.0, 668.0, 0.07280017472041933, 16.47042702902487, 0.03805712258709421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 104.24999999999999, 77, 246, 81.0, 235.9, 245.5, 246.0, 0.09860620134400253, 0.02657745270600068, 0.058065956455501486], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 525.6428571428571, 82, 1183, 488.5, 1027.0, 1183.0, 1183.0, 0.09272444282544623, 0.018265473391396496, 0.0629848370699076], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 232.07142857142858, 161, 323, 173.0, 322.0, 323.0, 323.0, 0.06928977975748578, 0.10738562546399405, 0.15583433865379856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e95fdb0-2b20-4bb0-901c-eb4dde51bfbc", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 780.3181818181818, 166, 1526, 831.5, 1097.6, 1463.4499999999991, 1526.0, 0.09349925200598394, 0.05743264600758194, 0.04227554070192439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 85.23076923076923, 80, 112, 82.0, 104.0, 112.0, 112.0, 0.07279895169509559, 0.0541015646874685, 0.03654166130007728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7644ea74-16ff-42bb-8a76-cc7658182710", 3, 0, 0.0, 416.6666666666667, 202, 628, 420.0, 628.0, 628.0, 628.0, 0.03631741420010895, 0.030276333908359057, 0.02328948762181466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 118.15384615384616, 78, 259, 81.0, 251.4, 259.0, 259.0, 0.07280099009346527, 0.1035904713304101, 0.03681612569930951], "isController": false}, {"data": ["login", 22, 0, 0.0, 2881.8636363636356, 1442, 3940, 2927.0, 3607.7999999999997, 3904.7499999999995, 3940.0, 0.09621734623812044, 31.524719999322105, 0.18868474441174027], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 85.75000000000001, 80, 108, 84.5, 90.80000000000001, 107.14999999999999, 108.0, 0.09896629702754726, 0.08012017601155927, 0.03517942589651094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3a8528f-5282-4b70-a19c-9bf41c86498b", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994cce86-301d-46e8-979d-cd4f2f4f9b25", 3, 0, 0.0, 580.3333333333333, 198, 1251, 292.0, 1251.0, 1251.0, 1251.0, 0.03334593068492541, 0.027799130365916015, 0.02138394643532001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3b7a437-f065-4cb1-ad64-2521f7d20ac4", 3, 0, 0.0, 598.6666666666666, 310, 1106, 380.0, 1106.0, 1106.0, 1106.0, 0.01818082650037271, 0.025063737053736466, 0.011658928452387446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 834.7692307692307, 162, 1228, 985.0, 1186.0, 1228.0, 1228.0, 0.07276513094924912, 66.98940414628309, 0.14932922268648863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8ba3342-de9d-45cf-87e0-810a47fb5b67", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 274.2380952380953, 160, 600, 320.0, 475.6000000000001, 589.3999999999999, 600.0, 0.138802596269515, 0.21511691433566432, 0.31217029219598924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 567.4, 79, 1086, 776.0, 1077.5, 1086.0, 1086.0, 0.09618159084351255, 69.05026690391459, 0.15561880831008945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c527d8f0-136d-4fbd-862f-790f9f989fcc", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1296.3333333333335, 285, 2437, 1298.0, 2039.5, 2365.5, 2437.0, 0.09994877625217076, 0.031233992578803365, 0.045094076785647356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 110.46666666666667, 82, 255, 86.0, 248.4, 255.0, 255.0, 0.07654974968231855, 0.05943071386469066, 0.02721104383238667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 206.35, 160, 482, 165.0, 327.40000000000003, 474.2999999999999, 482.0, 0.09856489512695157, 0.15275633649069548, 0.22167475925524366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20b66407-4062-4cb0-b767-feb298daf105", 3, 0, 0.0, 719.3333333333334, 174, 1497, 487.0, 1497.0, 1497.0, 1497.0, 0.02077806944030807, 0.02864424611969553, 0.01332447812415589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 409.35294117647055, 160, 941, 323.0, 941.0, 941.0, 941.0, 0.1384083044982699, 39.125081098615915, 0.30295103551801345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 112.41666666666669, 79, 282, 83.0, 270.90000000000003, 282.0, 282.0, 0.060120541686080595, 0.044679425999128254, 0.030177693776020923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 121.33333333333333, 79, 244, 81.0, 244.0, 244.0, 244.0, 0.06012144531954548, 0.023612149667328, 0.03386723994969839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 196.33333333333331, 78, 702, 158.0, 563.4000000000005, 702.0, 702.0, 0.06012174653673689, 4.522992066747664, 0.034914451764823766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 190.0, 77, 620, 157.5, 505.1000000000004, 620.0, 620.0, 0.06007389088578952, 1.4868190217717794, 0.034945326501596964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.5, 82, 87, 84.5, 87.0, 87.0, 87.0, 0.0384948513136368, 0.011352973727263979, 0.023796133673371186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20e570da-d6dd-47fe-983d-4921ff54e96f", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 897.6481481481484, 627, 1493, 795.0, 1277.0, 1343.25, 1493.0, 0.24205043613902658, 289.57647196921477, 0.47795506042296076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1296.3333333333335, 285, 2437, 1298.0, 2039.5, 2365.5, 2437.0, 0.10036088100126705, 0.031362775312895955, 0.045280006857993535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 140.25, 80, 318, 81.5, 318.0, 318.0, 318.0, 0.02158335491668825, 0.00581738862988863, 0.012709729506604506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 120.75, 82, 236, 82.5, 236.0, 236.0, 236.0, 0.021583121998597098, 0.005817325851184374, 0.012688515081206496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 155.46666666666667, 78, 714, 82.0, 433.20000000000016, 714.0, 714.0, 0.07430082919725385, 4.475759083585956, 0.04325507908084921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 158.8, 77, 623, 80.0, 395.60000000000014, 623.0, 623.0, 0.0743015652863087, 1.4751666367396474, 0.04332806772587676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 93.33333333333334, 80, 243, 82.0, 151.20000000000005, 243.0, 243.0, 0.07429935706289688, 0.05521661203600051, 0.03729479446321191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 81.0, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.02158323845701428, 0.005775202477755774, 0.012309190682515958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc85268-d572-430b-a1b0-54cb711954dd", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 91.26666666666667, 79, 236, 81.0, 147.20000000000005, 236.0, 236.0, 0.07430082919725385, 0.02732103406940688, 0.04195868440475129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 120.75, 79, 235, 84.5, 235.0, 235.0, 235.0, 0.02158253972536218, 0.01603936790136779, 0.010833423260582188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 128.0, 84, 240, 94.0, 240.0, 240.0, 240.0, 0.02245664464044105, 0.017675835527534652, 0.00798263539953178], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 473.1428571428571, 79, 1251, 451.0, 939.5, 1251.0, 1251.0, 0.09568200768189833, 0.018474316215366528, 0.06511395556254186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1519.6818181818185, 1065, 2053, 1462.0, 1928.3999999999999, 2036.6499999999999, 2053.0, 0.09486111470433516, 0.049098037884079716, 0.04363240725170103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 263.25, 164, 554, 167.5, 554.0, 554.0, 554.0, 0.021572994924952942, 0.03343392865810578, 0.048518171203287726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7644ea74-16ff-42bb-8a76-cc7658182710", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18d641d1-81db-44c0-8a6e-5c8f983e0f4f", 3, 0, 0.0, 638.3333333333334, 209, 1172, 534.0, 1172.0, 1172.0, 1172.0, 0.03898888816687244, 0.03250343183442719, 0.0250026398726363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d028c53-8bd3-4c72-aea3-9ed1d9497ca7", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["addBook", 62, 7, 11.290322580645162, 899.0967741935483, 420, 1802, 751.5, 1529.3000000000002, 1663.7, 1802.0, 0.2790027900279003, 87.23044115206777, 1.0144832893641436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f1169871-7287-4111-97f4-94c0d216781d", 3, 0, 0.0, 810.6666666666666, 199, 1766, 467.0, 1766.0, 1766.0, 1766.0, 0.03603343903142116, 0.030039595494619008, 0.023107381149706927], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 140.3518518518519, 78, 371, 83.0, 330.0, 336.75, 371.0, 0.24300461708772467, 0.1805922984411704, 0.1174680522054919], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 523.574074074074, 386, 730, 486.5, 674.5, 707.0, 730.0, 0.2426999015717066, 71.3618294572511, 0.12206098565373914], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 110.14814814814817, 78, 245, 84.0, 237.5, 240.5, 245.0, 0.2431490503678755, 0.4302598430337797, 0.11825022176093945], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 755.574074074074, 542, 1168, 709.5, 943.0, 1012.0, 1168.0, 0.24244818792428433, 218.15530567272637, 0.12169762557918178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 97.3529411764706, 81, 242, 87.0, 130.7999999999999, 242.0, 242.0, 0.13370245697926825, 0.09988513631751975, 0.04752704525434926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, 3.932584269662921, 159.67977528089892, 79, 710, 88.5, 334.69999999999993, 445.49999999999983, 633.3700000000008, 0.7335517504275618, 1.5401238383713503, 0.35564816174197933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 97.91666666666666, 80, 241, 84.0, 197.20000000000016, 241.0, 241.0, 0.06046619435850406, 0.04682587121708372, 0.021493842525874492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 92.85714285714286, 81, 247, 85.0, 89.8, 231.29999999999978, 247.0, 0.13259919682772206, 0.1076073560193721, 0.04713487074735433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97e15db3-df55-4abd-8ee4-d34b12f879b2", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3b7a437-f065-4cb1-ad64-2521f7d20ac4", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 337.66666666666663, 163, 782, 318.0, 705.2000000000003, 782.0, 782.0, 0.0600489398860071, 6.071926158881989, 0.13377113284827136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 271.6666666666667, 161, 797, 169.0, 611.6000000000001, 797.0, 797.0, 0.07426992662131249, 6.030940464607904, 0.16576796187229534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8ba3342-de9d-45cf-87e0-810a47fb5b67", 3, 0, 0.0, 390.3333333333333, 251, 585, 335.0, 585.0, 585.0, 585.0, 0.08549931600547195, 0.03785125968992248, 0.054828662933196534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e95fdb0-2b20-4bb0-901c-eb4dde51bfbc", 3, 0, 0.0, 311.6666666666667, 204, 445, 286.0, 445.0, 445.0, 445.0, 0.027825699816350382, 0.02774417921141967, 0.017843954634834066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994cce86-301d-46e8-979d-cd4f2f4f9b25", 1, 0, 0.0, 1183.0, 1183, 1183, 1183.0, 1183.0, 1183.0, 1183.0, 0.8453085376162299, 0.15271687447168217, 0.5828006128486898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1e96ed8-f31d-4a51-8855-50748202dd23", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 101.57142857142857, 81, 254, 86.0, 189.0, 254.0, 254.0, 0.06651273718917174, 0.05514581432969414, 0.02364319954771339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db574468-b6b4-4eb3-8cd2-a6b7e66926b2", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 86.61538461538461, 80, 95, 86.0, 93.0, 95.0, 95.0, 0.07333446155581881, 0.05693446966491792, 0.026068109381169966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 92.29411764705881, 79, 234, 83.0, 122.7999999999999, 234.0, 234.0, 0.13937510760578162, 0.10357857117968731, 0.06995977080993335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 145.94117647058826, 77, 243, 84.0, 242.2, 243.0, 243.0, 0.13937739298685753, 0.08655041464774413, 0.0767344286756688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 287.4117647058823, 77, 860, 82.0, 859.2, 860.0, 860.0, 0.13849851317772618, 29.35118283840482, 0.07862145606745692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c527d8f0-136d-4fbd-862f-790f9f989fcc", 3, 0, 0.0, 276.6666666666667, 184, 396, 250.0, 396.0, 396.0, 396.0, 0.02967359050445104, 0.02976052485163205, 0.01902896266073195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 237.52941176470586, 79, 644, 82.0, 629.6, 644.0, 644.0, 0.13875398917718884, 9.628194147438355, 0.07890198408002023], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.60882800608828], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15220700152207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15220700152207], "isController": false}, {"data": ["401/Unauthorized", 11, 47.82608695652174, 0.837138508371385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 23, "401/Unauthorized", 11, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
