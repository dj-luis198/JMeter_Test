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

    var data = {"OkPercent": 97.12879409351928, "KoPercent": 2.871205906480722};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7824106517168886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.34, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89f3daba-6e8a-4213-8101-cdbc54c585ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4a60874-c237-4bc0-afbe-496a61c1be53"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ce9b2fb-4578-4009-be6a-fb318413b5fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d7550ba-da34-4e7d-9504-8337b9a45f0f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fd88527-3280-4a4b-84c2-860cdce3921c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6fc17d6-352d-435f-ae04-b220ae4b618f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfd97763-5649-4890-8749-e66b0031cbe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1a8d592-45d0-4536-a41d-944a078fb3cd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b9b0713-ccc7-48dc-bdaa-6aee69492ecd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db7bfeef-baf9-4971-9b2a-61925c6edea3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00b9ccb5-a8b6-4cbb-a681-8fd7552966b1"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4a60874-c237-4bc0-afbe-496a61c1be53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89f3daba-6e8a-4213-8101-cdbc54c585ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6596e1b-b5e4-4593-a4bf-b5557748ccb4"], "isController": false}, {"data": [0.78, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.834375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c330f03-7c18-4ee4-9091-f63d1f6ae0f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6596e1b-b5e4-4593-a4bf-b5557748ccb4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6fc17d6-352d-435f-ae04-b220ae4b618f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/609d6996-0c62-4a0c-b36b-3534e9c1b41a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b9b0713-ccc7-48dc-bdaa-6aee69492ecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfd97763-5649-4890-8749-e66b0031cbe3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d7550ba-da34-4e7d-9504-8337b9a45f0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fd88527-3280-4a4b-84c2-860cdce3921c"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00b9ccb5-a8b6-4cbb-a681-8fd7552966b1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1a8d592-45d0-4536-a41d-944a078fb3cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db7bfeef-baf9-4971-9b2a-61925c6edea3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1219, 35, 2.871205906480722, 671.8252666119772, 77, 32076, 122.0, 856.0, 1081.0, 23466.19999999994, 4.846552347933953, 678.503518092818, 3.5427088758702125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 50, 0, 0.0, 5177.540000000001, 960, 28438, 1353.5, 21845.799999999996, 25589.999999999996, 28438.0, 0.23213166508043362, 279.3330095580213, 1.1413895836718586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89f3daba-6e8a-4213-8101-cdbc54c585ca", 3, 0, 0.0, 362.6666666666667, 299, 425, 364.0, 425.0, 425.0, 425.0, 0.04748789058790009, 0.021487033827207395, 0.030452846503308324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4a60874-c237-4bc0-afbe-496a61c1be53", 3, 0, 0.0, 243.33333333333331, 174, 375, 181.0, 375.0, 375.0, 375.0, 0.03094921234254588, 0.031039883863080684, 0.019846988383728965], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 493.9333333333334, 84, 1559, 402.0, 1221.2000000000003, 1559.0, 1559.0, 0.09158907037093574, 0.01933745802167608, 0.061083231567699584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 493.9333333333334, 84, 1559, 402.0, 1221.2000000000003, 1559.0, 1559.0, 0.088717499822565, 0.0187311752555064, 0.0591681033972888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 101.39999999999999, 78, 237, 82.0, 234.6, 237.0, 237.0, 0.12178982324236987, 0.03258829254727475, 0.06945825856791407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 102.53333333333333, 78, 242, 82.0, 237.2, 242.0, 242.0, 0.12193634922570419, 0.09061871265699305, 0.061206331544933545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 122.06666666666665, 77, 241, 81.0, 240.4, 241.0, 241.0, 0.12178191295028863, 0.03282403122488248, 0.07171337256740629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 122.33333333333331, 78, 241, 81.0, 238.6, 241.0, 241.0, 0.12194031428083667, 0.03286672533350676, 0.0716875675752575], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 182.6, 79, 358, 173.0, 322.6, 358.0, 358.0, 0.09138094889977338, 0.1416583186362307, 0.05905255851426761], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ce9b2fb-4578-4009-be6a-fb318413b5fe", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 98.5263157894737, 78, 240, 82.0, 236.0, 240.0, 240.0, 0.12419031184840938, 0.09229377667640579, 0.06233771512703361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 538.0, 403, 644, 542.5, 644.0, 644.0, 644.0, 0.03793536761742182, 11.154257652274937, 0.021635014344310883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 126.21052631578947, 78, 256, 83.0, 245.0, 256.0, 256.0, 0.12419112360284985, 0.05286548548924766, 0.06972984345382051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 855.125, 768, 945, 865.0, 945.0, 945.0, 945.0, 0.03785154623566373, 34.05888783877134, 0.021550245561906205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 143.12499999999997, 79, 248, 84.5, 248.0, 248.0, 248.0, 0.037975524774282975, 0.06719887782324292, 0.0210274634248227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 111.36363636363639, 79, 244, 83.0, 242.4, 244.0, 244.0, 0.05824173496833768, 0.043283164366118135, 0.029234620872778873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 111.1818181818182, 77, 241, 82.0, 241.0, 241.0, 241.0, 0.058244510454889625, 0.015584956899062263, 0.03321757236880424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 138.0, 79, 243, 82.0, 242.0, 243.0, 243.0, 0.05824481885861335, 0.01569879883298563, 0.034241582961801985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 127.18181818181819, 79, 248, 82.0, 247.4, 248.0, 248.0, 0.058245127265603075, 0.015698881958307077, 0.034298644278475246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 81.25, 77, 85, 81.0, 85.0, 85.0, 85.0, 0.038005292236943995, 0.02824416737530701, 0.021340862340080854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 193.3157894736842, 79, 923, 83.0, 696.0, 923.0, 923.0, 0.12406056767503966, 11.780435954548125, 0.07181178624364189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 472.1666666666667, 78, 928, 467.5, 926.2, 928.0, 928.0, 0.08351660588513682, 37.58544955857994, 0.045510025472564795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 170.3684210526316, 77, 614, 82.0, 465.0, 614.0, 614.0, 0.12406542818897123, 3.8698516928401188, 0.0719357573704659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 342.5555555555555, 77, 657, 357.5, 644.4, 657.0, 657.0, 0.08357748793930417, 12.298541616365402, 0.04562482007624124], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 349.07142857142856, 82, 766, 395.0, 618.5, 766.0, 766.0, 0.08940545373267769, 0.018341339245801138, 0.06027509140111118], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 269.36363636363643, 163, 485, 192.0, 485.0, 485.0, 485.0, 0.05821645938078857, 0.09022414163799948, 0.13093018159566022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d7550ba-da34-4e7d-9504-8337b9a45f0f", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 539.0454545454544, 84, 936, 498.0, 919.8, 933.75, 936.0, 0.0926327490452511, 0.0569003897943974, 0.0418837527421399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 108.38888888888887, 78, 251, 82.0, 240.20000000000002, 251.0, 251.0, 0.0835759357022468, 0.06211063190372052, 0.04195120210054185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 165.5, 78, 327, 159.5, 254.1000000000001, 327.0, 327.0, 0.08351660588513682, 0.0850662304083962, 0.044123519320174824], "isController": false}, {"data": ["login", 22, 0, 0.0, 3607.681818181818, 1567, 30675, 2277.5, 3227.1, 26570.99999999994, 30675.0, 0.09710537698955676, 42.37392784077367, 0.20506441783119556], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fd88527-3280-4a4b-84c2-860cdce3921c", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 87.6842105263158, 81, 101, 85.0, 101.0, 101.0, 101.0, 0.12774483305767342, 0.103418424418761, 0.04540929612596985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6fc17d6-352d-435f-ae04-b220ae4b618f", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfd97763-5649-4890-8749-e66b0031cbe3", 3, 0, 0.0, 240.0, 167, 381, 172.0, 381.0, 381.0, 381.0, 0.018062604988891496, 0.021349387602430023, 0.011583115829464925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1a8d592-45d0-4536-a41d-944a078fb3cd", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b9b0713-ccc7-48dc-bdaa-6aee69492ecd", 3, 0, 0.0, 477.0, 173, 1014, 244.0, 1014.0, 1014.0, 1014.0, 0.044125433900100014, 0.027449122455433312, 0.028296583588280286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 590.7777777777778, 162, 1167, 634.0, 1023.0000000000002, 1167.0, 1167.0, 0.08348445565815898, 50.002908730328976, 0.17707835711867315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 537.5333333333333, 79, 1023, 849.0, 1018.2, 1023.0, 1023.0, 0.07094479548980287, 45.27533342575864, 0.10717467672821522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db7bfeef-baf9-4971-9b2a-61925c6edea3", 3, 0, 0.0, 244.0, 171, 364, 197.0, 364.0, 364.0, 364.0, 0.04598758335249483, 0.02956558500038323, 0.029490735418103778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 237.33333333333331, 161, 483, 166.0, 476.4, 483.0, 483.0, 0.12169792951255923, 0.18860802161760887, 0.27370149576896863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00b9ccb5-a8b6-4cbb-a681-8fd7552966b1", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 3141.4347826086964, 88, 30342, 774.0, 15939.400000000034, 29394.599999999988, 30342.0, 0.09467085413691052, 0.02939169860092942, 0.04271282676880143], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 335.6842105263158, 160, 1003, 318.0, 776.0, 1003.0, 1003.0, 0.12399417879960584, 15.786690805423765, 0.275526332855847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 1987.6153846153843, 81, 24645, 85.0, 14888.599999999991, 24645.0, 24645.0, 0.06960544421659072, 0.054039382961122685, 0.024742560248866233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 378.12500000000006, 162, 1123, 321.5, 1103.4, 1123.0, 1123.0, 0.0769086565499738, 11.605480597988839, 0.17050964602790825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 81.71428571428571, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.03409976617303195, 0.025341720759450508, 0.01711648419232268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 128.14285714285714, 79, 244, 85.0, 244.0, 244.0, 244.0, 0.03407287701638419, 0.009117156545399675, 0.019432187673406605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 80.71428571428571, 78, 83, 80.0, 83.0, 83.0, 83.0, 0.034100098403141106, 0.009191042147721627, 0.020047128162784127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 80.42857142857143, 78, 87, 79.0, 87.0, 87.0, 87.0, 0.03410059676044331, 0.009191176470588236, 0.02008072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.33333333333333, 82, 90, 84.0, 90.0, 90.0, 90.0, 0.02432399562168079, 0.007173678396237889, 0.01503621994973041], "isController": false}, {"data": ["https://demoqa.com/books", 50, 0, 0.0, 914.5400000000001, 624, 1468, 839.5, 1345.5, 1401.1499999999999, 1468.0, 0.235283045503741, 281.4803200437627, 0.4645921074302386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 3141.4347826086964, 88, 30342, 774.0, 15939.400000000034, 29394.599999999988, 30342.0, 0.09357162908206232, 0.029050431039743533, 0.042216887339758584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 81.16666666666667, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.032331941263640036, 0.00871446854371548, 0.019039219318334907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 80.83333333333333, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.032331941263640036, 0.00871446854371548, 0.01900764515694463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 104.84615384615384, 78, 241, 80.0, 239.4, 241.0, 241.0, 0.07121960840172242, 0.019195910077026746, 0.04186934009554385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4a60874-c237-4bc0-afbe-496a61c1be53", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 106.53846153846153, 79, 243, 82.0, 242.2, 243.0, 243.0, 0.07121843790573966, 0.01919559459178139, 0.0419382012276963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89f3daba-6e8a-4213-8101-cdbc54c585ca", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 80.16666666666667, 78, 83, 80.0, 83.0, 83.0, 83.0, 0.032331767038841226, 0.008651273602189938, 0.018439210889339138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 81.38461538461539, 79, 84, 82.0, 83.6, 84.0, 84.0, 0.07121843790573966, 0.05292698363893347, 0.035748317464404475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 82.5, 80, 87, 82.0, 87.0, 87.0, 87.0, 0.032331767038841226, 0.024027807340388844, 0.016229031501918352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 122.46153846153848, 77, 236, 82.0, 236.0, 236.0, 236.0, 0.07121921823211987, 0.019056704878516448, 0.040617210398005865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 89.66666666666666, 84, 105, 85.5, 105.0, 105.0, 105.0, 0.031621219946665544, 0.02488935866895745, 0.011240355527916267], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 444.2857142857143, 80, 1014, 382.5, 857.0, 1014.0, 1014.0, 0.08868786306593943, 0.017674471594544428, 0.06034808204577561], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2553.8181818181815, 802, 30403, 1166.5, 1853.1999999999998, 26127.09999999994, 30403.0, 0.09565258979386866, 0.049507688076904685, 0.04399645487589077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 164.83333333333331, 163, 169, 164.0, 169.0, 169.0, 169.0, 0.03231766106314332, 0.05008606260469575, 0.0726831771761905], "isController": false}, {"data": ["addBook", 55, 12, 21.818181818181817, 4225.127272727271, 414, 33239, 681.0, 25549.6, 29012.59999999999, 33239.0, 0.256473627516356, 73.52377113430124, 0.9331914980741162], "isController": true}, {"data": ["https://demoqa.com/books-0", 50, 0, 0.0, 159.12000000000003, 80, 431, 85.0, 325.7, 331.9, 431.0, 0.23604947597016335, 0.17542348751298273, 0.11410594785667076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6596e1b-b5e4-4593-a4bf-b5557748ccb4", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books-3", 50, 0, 0.0, 535.5200000000002, 385, 740, 487.0, 704.5, 735.15, 740.0, 0.23600156705040523, 69.39229670235011, 0.1186921943661706], "isController": false}, {"data": ["https://demoqa.com/books-1", 50, 0, 0.0, 128.70000000000002, 79, 330, 85.0, 245.8, 251.79999999999998, 330.0, 0.23636303471227527, 0.41825177626820587, 0.11494999149093076], "isController": false}, {"data": ["https://demoqa.com/books-2", 50, 0, 0.0, 753.9999999999997, 542, 1096, 727.0, 1010.5999999999999, 1043.1999999999998, 1096.0, 0.2356867440347685, 212.07134657558947, 0.11830369768932716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 84.74999999999999, 81, 94, 84.5, 89.80000000000001, 94.0, 94.0, 0.07575398892097912, 0.05659355617631741, 0.026928175749254296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 12, 7.5, 1696.2624999999991, 80, 32076, 88.0, 412.80000000000024, 17366.299999999974, 29107.739999999932, 0.684389503175995, 1.4481788823063926, 0.3297634578779648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 2407.5714285714284, 84, 15997, 95.0, 15997.0, 15997.0, 15997.0, 0.034633919471189524, 0.026820994277981732, 0.012311276062024402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c330f03-7c18-4ee4-9091-f63d1f6ae0f9", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 86.6, 82, 105, 85.0, 96.60000000000001, 105.0, 105.0, 0.12573660695574912, 0.10203820349631593, 0.04469543450380144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6596e1b-b5e4-4593-a4bf-b5557748ccb4", 3, 0, 0.0, 378.0, 196, 629, 309.0, 629.0, 629.0, 629.0, 0.05519372999227288, 0.02497372548478493, 0.035394416694263534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6fc17d6-352d-435f-ae04-b220ae4b618f", 3, 0, 0.0, 567.3333333333334, 358, 960, 384.0, 960.0, 960.0, 960.0, 0.02697332338317404, 0.022486549864683826, 0.01729734604975679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/609d6996-0c62-4a0c-b36b-3534e9c1b41a", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b9b0713-ccc7-48dc-bdaa-6aee69492ecd", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 211.14285714285714, 160, 325, 168.0, 325.0, 325.0, 325.0, 0.034059116895754776, 0.0527849790171512, 0.07659975215910474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfd97763-5649-4890-8749-e66b0031cbe3", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d7550ba-da34-4e7d-9504-8337b9a45f0f", 3, 0, 0.0, 335.0, 173, 585, 247.0, 585.0, 585.0, 585.0, 0.027425562452576633, 0.027505910780074416, 0.0175873561300703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 218.1538461538462, 160, 325, 166.0, 323.8, 325.0, 325.0, 0.07118606943379696, 0.110324504093199, 0.1600991385801117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fd88527-3280-4a4b-84c2-860cdce3921c", 3, 0, 0.0, 330.66666666666663, 157, 665, 170.0, 665.0, 665.0, 665.0, 0.025396825396825397, 0.02117228835978836, 0.01628637566137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 2369.090909090909, 84, 20439, 89.0, 17283.40000000001, 20439.0, 20439.0, 0.058836429377564066, 0.04878137552885927, 0.020914512005305974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 3646.166666666667, 79, 24113, 88.5, 24033.8, 24113.0, 24113.0, 0.08412944717605489, 0.06531534229000356, 0.029905389425863262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00b9ccb5-a8b6-4cbb-a681-8fd7552966b1", 3, 0, 0.0, 324.0, 186, 515, 271.0, 515.0, 515.0, 515.0, 0.023747892374551757, 0.02381746627799283, 0.015228954419878569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a8d592-45d0-4536-a41d-944a078fb3cd", 3, 0, 0.0, 370.0, 177, 700, 233.0, 700.0, 700.0, 700.0, 0.0264298551643937, 0.03170378134140325, 0.0169488329016457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 117.375, 79, 267, 84.0, 246.70000000000002, 267.0, 267.0, 0.07693898257812913, 0.05717828685737917, 0.03861976273941248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 130.50000000000003, 78, 245, 81.0, 244.3, 245.0, 245.0, 0.07694194249551572, 0.03503337957864668, 0.04307321146050233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 208.87500000000003, 77, 1043, 81.0, 912.1000000000001, 1043.0, 1043.0, 0.07694194249551572, 8.672207864067632, 0.04440692188950175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 181.00000000000003, 78, 578, 82.5, 559.1, 578.0, 578.0, 0.07694046250835526, 2.8460269568123566, 0.04448120488764288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db7bfeef-baf9-4971-9b2a-61925c6edea3", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.7383100902379], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.3281378178835111], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2461033634126333], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.5586546349466777], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1219, 35, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
