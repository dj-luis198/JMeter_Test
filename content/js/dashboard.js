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

    var data = {"OkPercent": 97.70200148257969, "KoPercent": 2.2979985174203112};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.802547770700637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad12a4c9-096c-4789-89ee-a22fd53d0201"], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7551b0ab-719d-40d4-ba69-836b87ebd216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/424d8d87-fedf-4679-aeb3-d9a9db2b3c0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b921a33-72d7-4e93-8861-512e5aeb35be"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df22661d-4962-467e-81dd-9a352be24b3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70ae8159-41ac-4af8-891f-3ec340d8092a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bd46f0dd-6f68-48a1-bde6-7e5aaa638c7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2020b6bb-5e97-496d-b5fa-b74af8f7d31b"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b292eabb-191e-4c71-a4eb-92b2e13538d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef96eea7-d01c-49ec-bee5-b9cbbdabcd8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb4f9ea3-93fa-465b-a194-4e283077cd78"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a67cfc4f-bb90-418a-88c2-1ef9975bb3ff"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b921a33-72d7-4e93-8861-512e5aeb35be"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd46f0dd-6f68-48a1-bde6-7e5aaa638c7e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb4f9ea3-93fa-465b-a194-4e283077cd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=424d8d87-fedf-4679-aeb3-d9a9db2b3c0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7551b0ab-719d-40d4-ba69-836b87ebd216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df22661d-4962-467e-81dd-9a352be24b3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14bd6918-9e69-433f-89fa-b59ab018b478"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53247c87-7f1a-411b-8a92-d60bb847f4b8"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70ae8159-41ac-4af8-891f-3ec340d8092a"], "isController": false}, {"data": [0.7719298245614035, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2020b6bb-5e97-496d-b5fa-b74af8f7d31b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53247c87-7f1a-411b-8a92-d60bb847f4b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b292eabb-191e-4c71-a4eb-92b2e13538d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef96eea7-d01c-49ec-bee5-b9cbbdabcd8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad12a4c9-096c-4789-89ee-a22fd53d0201"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1349, 31, 2.2979985174203112, 316.6130467012597, 81, 2624, 101.0, 853.0, 1067.5, 1564.5, 5.253585796235644, 758.1765493197892, 3.8514541557460364], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad12a4c9-096c-4789-89ee-a22fd53d0201", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1364.6666666666667, 995, 1716, 1353.0, 1671.2, 1706.3, 1716.0, 0.25771447948457105, 310.11681661156325, 1.2671800822312647], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7551b0ab-719d-40d4-ba69-836b87ebd216", 3, 0, 0.0, 939.0, 278, 2127, 412.0, 2127.0, 2127.0, 2127.0, 0.022375369193591694, 0.026446928887347475, 0.014348788187296757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/424d8d87-fedf-4679-aeb3-d9a9db2b3c0f", 3, 0, 0.0, 282.6666666666667, 164, 454, 230.0, 454.0, 454.0, 454.0, 0.0414868901427149, 0.02667207292703839, 0.026604548691780066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b921a33-72d7-4e93-8861-512e5aeb35be", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 561.8571428571428, 86, 1341, 480.5, 1151.5, 1341.0, 1341.0, 0.09602919287463389, 0.018916464891041165, 0.06461339247131129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 561.8571428571428, 86, 1341, 480.5, 1151.5, 1341.0, 1341.0, 0.09684828025125211, 0.019077814134314728, 0.06516451669249287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df22661d-4962-467e-81dd-9a352be24b3c", 3, 0, 0.0, 320.0, 174, 611, 175.0, 611.0, 611.0, 611.0, 0.019029616426364897, 0.02249236238415721, 0.012203237096334262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 111.38888888888889, 81, 261, 83.5, 250.20000000000002, 261.0, 261.0, 0.11891863322850876, 0.041742814506751935, 0.06726593261938109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 93.77777777777777, 82, 246, 84.5, 104.70000000000022, 246.0, 246.0, 0.1189131339556454, 0.08837196771508413, 0.05968881919257982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 161.1111111111111, 81, 662, 84.0, 295.70000000000056, 662.0, 662.0, 0.11891784758695868, 1.9728156071416774, 0.06945906831169689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 146.77777777777777, 82, 738, 84.0, 296.1000000000007, 738.0, 738.0, 0.11891784758695868, 5.974854088213919, 0.06934293760116275], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 216.46666666666664, 83, 402, 178.0, 366.0, 402.0, 402.0, 0.07706693520212089, 0.14524809291446597, 0.04981253468012084], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70ae8159-41ac-4af8-891f-3ec340d8092a", 3, 0, 0.0, 257.0, 191, 371, 209.0, 371.0, 371.0, 371.0, 0.09637934911812895, 0.04473859109454814, 0.06180576750088348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd46f0dd-6f68-48a1-bde6-7e5aaa638c7e", 3, 0, 0.0, 1078.3333333333333, 342, 2273, 620.0, 2273.0, 2273.0, 2273.0, 0.022563007197599294, 0.026668710655756198, 0.014469115943772985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 96.83333333333331, 83, 248, 86.0, 136.40000000000018, 248.0, 248.0, 0.09687679962110407, 0.07199535596841816, 0.048627612309812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 595.1, 488, 736, 643.0, 728.6, 736.0, 736.0, 0.0432656946307273, 12.72155077770086, 0.02467496646908666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 129.27777777777777, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.0968804495252858, 0.03400697202846133, 0.05480010670305066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 866.0, 728, 1052, 845.5, 1045.2, 1052.0, 1052.0, 0.043201769544480545, 38.87302817673412, 0.024596319965265775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 136.00000000000003, 82, 253, 88.0, 252.9, 253.0, 253.0, 0.04337040056901966, 0.07674527913189806, 0.024014665158822408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 87.0, 83, 99, 85.0, 98.2, 99.0, 99.0, 0.06526366520743804, 0.04850161056919956, 0.0327593006998273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 84.92307692307693, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.06526399285108263, 0.017463216837106093, 0.037220870922883065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 84.53846153846155, 82, 91, 84.0, 89.4, 91.0, 91.0, 0.06526399285108263, 0.017590685573143364, 0.0383680895472185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 111.61538461538461, 82, 263, 86.0, 256.2, 263.0, 263.0, 0.06526300993001798, 0.017590420645200156, 0.03843124510527426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 101.2, 82, 245, 84.5, 229.70000000000005, 245.0, 245.0, 0.04336851965894996, 0.03222992525435637, 0.02435244023817991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 138.44444444444443, 82, 1058, 84.0, 185.00000000000136, 1058.0, 1058.0, 0.0968778424228072, 4.867486122585454, 0.056491050909306194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 611.7857142857143, 82, 1068, 784.5, 1035.0, 1068.0, 1068.0, 0.0663824864034443, 38.404940168338875, 0.0353583053973703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 116.05555555555556, 82, 493, 85.0, 270.70000000000033, 493.0, 493.0, 0.09688097096262009, 1.6072296583600205, 0.05658748553513281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 441.49999999999994, 82, 739, 509.0, 734.0, 739.0, 739.0, 0.06638059789952823, 12.553739761385458, 0.03542212429766957], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 498.4285714285713, 87, 1134, 505.0, 1019.0, 1134.0, 1134.0, 0.09677932240648698, 0.019064230362438563, 0.06573919095942873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 200.07692307692307, 169, 352, 173.0, 343.59999999999997, 352.0, 352.0, 0.06523484544359695, 0.10110126925682457, 0.14671469634433962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2020b6bb-5e97-496d-b5fa-b74af8f7d31b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 703.5416666666667, 139, 2075, 583.5, 1305.5, 1897.75, 2075.0, 0.10481768274307876, 0.06438508051308256, 0.047393151474653776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 108.85714285714285, 83, 401, 85.0, 250.0, 401.0, 401.0, 0.06638059789952823, 0.04933167480619236, 0.03331994855503663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 174.85714285714286, 82, 334, 168.0, 310.5, 334.0, 334.0, 0.06638217164532954, 0.08185714497392128, 0.03427461178283547], "isController": false}, {"data": ["login", 24, 0, 0.0, 2871.2916666666665, 1615, 4622, 2629.5, 4538.5, 4606.5, 4622.0, 0.10312910905043873, 51.543547676264836, 0.22685382630479808], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b292eabb-191e-4c71-a4eb-92b2e13538d1", 3, 0, 0.0, 283.0, 178, 396, 275.0, 396.0, 396.0, 396.0, 0.036516341062625524, 0.030442171048627592, 0.023417054652790457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef96eea7-d01c-49ec-bee5-b9cbbdabcd8c", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 97.66666666666669, 84, 252, 88.0, 115.20000000000022, 252.0, 252.0, 0.09504548982749243, 0.07694600690135862, 0.03378570146211645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb4f9ea3-93fa-465b-a194-4e283077cd78", 3, 0, 0.0, 439.66666666666663, 173, 941, 205.0, 941.0, 941.0, 941.0, 0.06306363120388472, 0.0279187950642198, 0.040441195791553676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 722.0000000000001, 166, 1153, 871.0, 1123.0, 1153.0, 1153.0, 0.06635291218192073, 51.06746635996218, 0.13831545951761434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a67cfc4f-bb90-418a-88c2-1ef9975bb3ff", 2, 0, 0.0, 208.0, 166, 250, 208.0, 250.0, 250.0, 250.0, 0.021832392721080264, 0.030680481568002446, 0.013570623014616787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 4, 28.571428571428573, 715.2857142857143, 83, 1139, 855.5, 1134.5, 1139.0, 1139.0, 0.06045792560220412, 51.667977488059556, 0.10882089231579765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 287.55555555555554, 165, 823, 252.0, 534.1000000000005, 823.0, 823.0, 0.11884796703949714, 8.073040896493325, 0.265602509672904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b921a33-72d7-4e93-8861-512e5aeb35be", 3, 0, 0.0, 342.3333333333333, 210, 412, 405.0, 412.0, 412.0, 412.0, 0.029686804215526198, 0.029773777274751372, 0.019037436297065953], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1032.625, 217, 2624, 993.5, 1568.0, 2362.0, 2624.0, 0.10929857638604257, 0.033835594447632324, 0.049312443642921554], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 273.05555555555554, 168, 1146, 173.0, 560.1000000000009, 1146.0, 1146.0, 0.09683093856076949, 6.577480006764717, 0.21639865566380298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 94.17647058823528, 85, 117, 90.0, 109.8, 117.0, 117.0, 0.10728056391712892, 0.08328910968175536, 0.03813488795491692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd46f0dd-6f68-48a1-bde6-7e5aaa638c7e", 1, 0, 0.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.15931575176366844, 0.6079833553791888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 353.4761904761905, 166, 1035, 329.0, 982.8, 1029.8, 1035.0, 0.09613227801454802, 16.557363289028558, 0.2126899828449661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 88.5, 83, 107, 87.0, 107.0, 107.0, 107.0, 0.05972511515748766, 0.04438555921371886, 0.0299792081942858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 104.125, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.059653858486134206, 0.01596206760273513, 0.03402134116787341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 104.75, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.059726898755440745, 0.016098265680177387, 0.03511288383864778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 0.015004201176329371, 0.004425067143800265, 0.009275057953727043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 105.625, 81, 257, 84.0, 257.0, 257.0, 257.0, 0.05972823652381663, 0.016098626250559953, 0.03517199865611468], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 926.7543859649122, 650, 1360, 823.0, 1288.2, 1345.7, 1360.0, 0.25357112670103965, 303.35922312146056, 0.5007039240131858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1032.625, 217, 2624, 993.5, 1568.0, 2362.0, 2624.0, 0.104121926776255, 0.032233057410227375, 0.04697688493225567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 109.71428571428572, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.04177907226585814, 0.011260765571657077, 0.024602324781555135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 153.14285714285714, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.04177882291150649, 0.011260698362866983, 0.024561378313209866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb4f9ea3-93fa-465b-a194-4e283077cd78", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 150.64705882352942, 82, 260, 85.0, 248.79999999999998, 260.0, 260.0, 0.11081199116111412, 0.029867294492644036, 0.06514533074120185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 133.8235294117647, 83, 260, 86.0, 251.2, 260.0, 260.0, 0.11081271347743331, 0.029867489179464447, 0.0652539709246995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=424d8d87-fedf-4679-aeb3-d9a9db2b3c0f", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 108.14285714285714, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.04182000669120107, 0.011190118977919038, 0.02385047256607561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 123.70588235294117, 83, 251, 86.0, 249.4, 251.0, 251.0, 0.11069582090718481, 0.08226515596715589, 0.05556411322880175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7551b0ab-719d-40d4-ba69-836b87ebd216", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 107.14285714285714, 83, 245, 84.0, 245.0, 245.0, 245.0, 0.04181950700775453, 0.031078754719630078, 0.020991432228501788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 113.0, 82, 261, 84.0, 247.39999999999998, 261.0, 261.0, 0.11081343580316927, 0.0296512513770199, 0.06319828760649497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df22661d-4962-467e-81dd-9a352be24b3c", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.42857142857142, 84, 98, 87.0, 98.0, 98.0, 98.0, 0.04221648614093069, 0.03322899202108412, 0.015006641557908956], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 429.07142857142856, 84, 941, 408.5, 780.5, 941.0, 941.0, 0.09463615777199445, 0.018272383141244464, 0.06440222901950181], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1438.4583333333335, 1076, 2308, 1330.0, 1940.5, 2271.0, 2308.0, 0.10475180369511987, 0.054217242146888216, 0.0481817378324233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 264.0, 167, 494, 190.0, 494.0, 494.0, 494.0, 0.041757887766728514, 0.06471657020097474, 0.09391446828786694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14bd6918-9e69-433f-89fa-b59ab018b478", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53247c87-7f1a-411b-8a92-d60bb847f4b8", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 889.5084745762712, 429, 2734, 760.0, 1465.0, 1543.0, 2734.0, 0.28456774641637567, 81.95040988758369, 1.0346526419583084], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 144.4912280701754, 82, 356, 86.0, 336.0, 339.3999999999999, 356.0, 0.254584758859103, 0.1891982436443138, 0.12306587464380465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70ae8159-41ac-4af8-891f-3ec340d8092a", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 537.9649122807016, 405, 832, 492.0, 698.4000000000001, 739.2, 832.0, 0.25445746988919943, 74.81894493060453, 0.1279742158134157], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 136.9824561403509, 81, 350, 88.0, 253.0, 277.89999999999964, 350.0, 0.25460863971984116, 0.4505379445042502, 0.12382334236375088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2020b6bb-5e97-496d-b5fa-b74af8f7d31b", 3, 0, 0.0, 387.3333333333333, 304, 456, 402.0, 456.0, 456.0, 456.0, 0.04912797838368951, 0.03158455641529518, 0.031504595512977976], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 780.8245614035087, 565, 1067, 734.0, 984.2, 1012.4, 1067.0, 0.2539903216319546, 228.54093787179502, 0.12749123566291473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 106.52380952380952, 85, 265, 90.0, 222.4000000000001, 263.59999999999997, 265.0, 0.09237265769332278, 0.06900887024940618, 0.03283559316442333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 154.31428571428586, 83, 2214, 93.0, 273.80000000000007, 386.2, 1002.5600000000145, 0.7247006986114735, 1.618553496111463, 0.3465864914754492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 87.875, 86, 91, 88.0, 91.0, 91.0, 91.0, 0.058380950295918436, 0.04521102889127278, 0.020752603425502256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 88.61111111111111, 84, 111, 85.5, 102.00000000000001, 111.0, 111.0, 0.114895572690599, 0.09324045010340602, 0.04084178560486136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53247c87-7f1a-411b-8a92-d60bb847f4b8", 3, 0, 0.0, 293.0, 191, 377, 311.0, 377.0, 377.0, 377.0, 0.03323326428199533, 0.027705205021546234, 0.02131169617042018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 216.62499999999997, 168, 341, 176.0, 341.0, 341.0, 341.0, 0.05961429550806283, 0.09239051462040597, 0.13407394780768428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 297.3529411764706, 168, 508, 331.0, 500.0, 508.0, 508.0, 0.11063458697505515, 0.17146200149356694, 0.24881977910503128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b292eabb-191e-4c71-a4eb-92b2e13538d1", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 139.9230769230769, 85, 421, 91.0, 352.19999999999993, 421.0, 421.0, 0.0680250750892175, 0.05639969604565006, 0.024180788410620286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef96eea7-d01c-49ec-bee5-b9cbbdabcd8c", 3, 0, 0.0, 504.6666666666667, 320, 828, 366.0, 828.0, 828.0, 828.0, 0.031625886842576875, 0.03171854080793599, 0.020280923528605617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 89.00000000000001, 84, 102, 87.0, 100.0, 102.0, 102.0, 0.06719978496068812, 0.05217170805053424, 0.023887423560244606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad12a4c9-096c-4789-89ee-a22fd53d0201", 3, 0, 0.0, 257.0, 170, 429, 172.0, 429.0, 429.0, 429.0, 0.03084579160583191, 0.030936160135927124, 0.019780667143062782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 85.38095238095238, 81, 98, 84.0, 90.4, 97.29999999999998, 98.0, 0.09616925789389325, 0.0714695363840359, 0.048272459528770635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 146.5238095238095, 82, 251, 86.0, 248.8, 250.8, 251.0, 0.09617057913006842, 0.04636795779485442, 0.0536934511270276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 242.90476190476193, 83, 950, 85.0, 898.8, 944.9, 950.0, 0.0961710195501944, 12.384339858937723, 0.05535736979130889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 193.47619047619045, 81, 733, 85.0, 489.4, 708.6999999999996, 733.0, 0.09617057913006842, 4.061838469491029, 0.05545103286057098], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 32.25806451612903, 0.7412898443291327], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.14825796886582654], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14825796886582654], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.2601927353595255], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1349, 31, "401/Unauthorized", 17, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
