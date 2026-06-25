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

    var data = {"OkPercent": 99.76708074534162, "KoPercent": 0.2329192546583851};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8314343163538874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=998fc4c4-2f50-4741-81c7-6ac586799324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9300b563-4497-4069-9436-827dc244f8c5"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6a1ef17-8c21-4e4c-b244-f47c54556fc2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8158412b-15cf-4ea7-95c3-03d4fd016aa1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2762613-7efe-4918-af38-70049164031f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d31e8fd3-9d4e-40f2-a7b7-ee50e0b09b1b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c813f368-7fd3-49f5-8969-85bfd3165ada"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/868e8520-1794-4508-a6a7-e4e156b9115c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f39ed4ba-7f08-4d55-9177-858d013e181e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2defa2b8-48d3-4f78-8310-4d9a1fcf4080"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54c68217-2133-44fd-bd17-60502411b3ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41293f93-a8e6-4ca1-a3dd-c1a83ec47d23"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7de694a1-e353-417b-bd34-a1b7473f04a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc7691cb-aedc-4b6b-8c2b-96d44214189e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22900107-c004-4530-9f9c-6e9965d32726"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9300b563-4497-4069-9436-827dc244f8c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8158412b-15cf-4ea7-95c3-03d4fd016aa1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/998fc4c4-2f50-4741-81c7-6ac586799324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd2fc70b-76d4-4872-bdd5-dcdd92ea855d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9ef7ad8-0293-41a5-80b1-fb386837a75d"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d31e8fd3-9d4e-40f2-a7b7-ee50e0b09b1b"], "isController": false}, {"data": [0.4262295081967213, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9971751412429378, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22900107-c004-4530-9f9c-6e9965d32726"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6a1ef17-8c21-4e4c-b244-f47c54556fc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54c68217-2133-44fd-bd17-60502411b3ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7de694a1-e353-417b-bd34-a1b7473f04a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd2fc70b-76d4-4872-bdd5-dcdd92ea855d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c813f368-7fd3-49f5-8969-85bfd3165ada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc7691cb-aedc-4b6b-8c2b-96d44214189e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=868e8520-1794-4508-a6a7-e4e156b9115c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 3, 0.2329192546583851, 306.33618012422374, 79, 2985, 99.0, 841.5000000000007, 1031.6499999999999, 1556.3299999999997, 5.172005316564471, 723.9226601933781, 3.7768157545887493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1340.9818181818187, 1035, 1870, 1307.0, 1594.1999999999998, 1725.1999999999996, 1870.0, 0.24284383375352675, 292.2222639226785, 1.1940612333486398], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 540.0833333333334, 398, 1167, 453.0, 1001.4000000000005, 1167.0, 1167.0, 0.06675010429703797, 0.012059345014601585, 0.04536921151439299], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 540.0833333333334, 398, 1167, 453.0, 1001.4000000000005, 1167.0, 1167.0, 0.06706270922168137, 0.01211582149024517, 0.045581685174111555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=998fc4c4-2f50-4741-81c7-6ac586799324", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 100.29411764705883, 80, 241, 82.0, 240.2, 241.0, 241.0, 0.11330009863773292, 0.040326712497667346, 0.06405673085894804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 83.41176470588233, 80, 92, 83.0, 86.39999999999999, 92.0, 92.0, 0.11330009863773292, 0.08420056158526831, 0.056871338574018285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 143.1176470588235, 80, 643, 82.0, 325.39999999999975, 643.0, 643.0, 0.11330160888284614, 1.9884145980792045, 0.06614684346716253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 180.11764705882354, 80, 1107, 82.0, 417.3999999999994, 1107.0, 1107.0, 0.11330085375525682, 6.025701017791566, 0.06603575724958845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9300b563-4497-4069-9436-827dc244f8c5", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 297.0, 172, 892, 206.5, 749.2000000000005, 892.0, 892.0, 0.06664334149714267, 0.1621394317544415, 0.043083878975691846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 101.77777777777777, 80, 250, 83.0, 245.5, 250.0, 250.0, 0.0936753524535136, 0.06961615548547252, 0.04702063589951758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 109.66666666666666, 80, 255, 83.0, 246.0, 255.0, 255.0, 0.09367583996003163, 0.04851505904180024, 0.052113284665265006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 585.6666666666666, 475, 642, 640.0, 642.0, 642.0, 642.0, 0.11203226529240422, 32.941205817275375, 0.06389340129957428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 942.6666666666666, 868, 1004, 956.0, 1004.0, 1004.0, 1004.0, 0.11041183614883515, 99.3487642500276, 0.06286142624489345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 138.66666666666666, 80, 254, 82.0, 254.0, 254.0, 254.0, 0.1129645667808864, 0.19989433106149038, 0.06254971617652597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6a1ef17-8c21-4e4c-b244-f47c54556fc2", 3, 0, 0.0, 788.3333333333334, 184, 1763, 418.0, 1763.0, 1763.0, 1763.0, 0.01825050645155403, 0.02515979649164431, 0.011703612535664532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8158412b-15cf-4ea7-95c3-03d4fd016aa1", 3, 0, 0.0, 811.0, 416, 1574, 443.0, 1574.0, 1574.0, 1574.0, 0.070779756989501, 0.03202599681491094, 0.04538936239235579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 84.33333333333334, 80, 91, 83.0, 90.7, 91.0, 91.0, 0.058824106118687436, 0.043715961676094865, 0.02952694389160678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 122.66666666666666, 81, 245, 82.5, 244.4, 245.0, 245.0, 0.058824394476389354, 0.023102744770756432, 0.03313659330774472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 190.0, 82, 723, 85.5, 580.2000000000005, 723.0, 723.0, 0.058824106118687436, 4.42536986422661, 0.03416087412621693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 156.08333333333331, 80, 644, 83.0, 524.6000000000004, 644.0, 644.0, 0.05882468283691837, 1.4559013258838407, 0.0342186550226475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2762613-7efe-4918-af38-70049164031f", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 85.0, 82, 90, 83.0, 90.0, 90.0, 90.0, 0.11369665731827484, 0.08449526974531948, 0.06384333784961722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 237.33333333333334, 81, 1030, 83.0, 971.5000000000001, 1030.0, 1030.0, 0.09367583996003163, 14.06932138196584, 0.05372943685207544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 496.4, 81, 1051, 407.0, 1014.2, 1049.35, 1051.0, 0.09752434451449943, 43.889431241070426, 0.053143148670986996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 187.88888888888889, 81, 635, 85.0, 486.5000000000002, 635.0, 635.0, 0.0936748649520697, 4.611627018563236, 0.05382035697929786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 389.45, 80, 741, 438.0, 718.7000000000002, 740.25, 741.0, 0.09752529562355236, 14.350980586370842, 0.05323890649762282], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 476.9166666666667, 176, 943, 448.5, 863.5000000000002, 943.0, 943.0, 0.06710170941604737, 0.012122867423797621, 0.04626348324973579], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d31e8fd3-9d4e-40f2-a7b7-ee50e0b09b1b", 3, 0, 0.0, 295.6666666666667, 200, 466, 221.0, 466.0, 466.0, 466.0, 0.0851305334846765, 0.03946154937570942, 0.05459217153802497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 289.00000000000006, 165, 806, 250.0, 664.7000000000005, 806.0, 806.0, 0.05879989416019051, 5.945627286152135, 0.13098863140796346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 646.75, 90, 1556, 562.5, 1335.6000000000008, 1546.6999999999998, 1556.0, 0.09077705156136529, 0.05576051311728395, 0.04104470202432825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 91.15, 81, 242, 83.0, 91.20000000000002, 234.4999999999999, 242.0, 0.09752339342399759, 0.07247588124576382, 0.04895217208978003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 107.05000000000001, 80, 245, 83.5, 241.8, 244.85, 245.0, 0.09752386896692966, 0.09933339387940199, 0.05152384092881733], "isController": false}, {"data": ["login", 20, 0, 0.0, 2782.9999999999995, 1700, 4463, 2732.5, 3961.4, 4438.45, 4463.0, 0.08763051469782807, 15.848453533645737, 0.15401234111492304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 89.5, 81, 122, 86.0, 100.40000000000003, 122.0, 122.0, 0.09604200236903607, 0.07775275387102626, 0.034139930529618286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c813f368-7fd3-49f5-8969-85bfd3165ada", 2, 0, 0.0, 265.5, 192, 339, 265.5, 339.0, 339.0, 339.0, 0.013998936080857853, 0.027669772097320605, 0.00870148712447854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/868e8520-1794-4508-a6a7-e4e156b9115c", 3, 0, 0.0, 294.0, 173, 536, 173.0, 536.0, 536.0, 536.0, 0.029363401456424715, 0.024479059612598855, 0.018830045855845273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 605.0, 164, 1136, 646.0, 1099.1000000000001, 1134.35, 1136.0, 0.09748393952096392, 58.38788181717374, 0.20677257484329456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f39ed4ba-7f08-4d55-9177-858d013e181e", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2defa2b8-48d3-4f78-8310-4d9a1fcf4080", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54c68217-2133-44fd-bd17-60502411b3ec", 3, 0, 0.0, 509.66666666666663, 172, 809, 548.0, 809.0, 809.0, 809.0, 0.01654177625593436, 0.022804173972617844, 0.01060784479954124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41293f93-a8e6-4ca1-a3dd-c1a83ec47d23", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 283.8235294117647, 166, 1200, 167.0, 503.9999999999994, 1200.0, 1200.0, 0.11323670467867421, 8.134022509125547, 0.252967727955478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1027.6666666666667, 950, 1087, 1046.0, 1087.0, 1087.0, 1087.0, 0.11007558523519484, 131.68866840647243, 0.2482075452227196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7de694a1-e353-417b-bd34-a1b7473f04a0", 3, 0, 0.0, 387.6666666666667, 185, 586, 392.0, 586.0, 586.0, 586.0, 0.019746975421597923, 0.027222799775542712, 0.012663262233251274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc7691cb-aedc-4b6b-8c2b-96d44214189e", 3, 0, 0.0, 312.0, 216, 379, 341.0, 379.0, 379.0, 379.0, 0.01631347982838219, 0.022489448917056832, 0.010461443770153945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22900107-c004-4530-9f9c-6e9965d32726", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1124.2380952380956, 88, 2126, 1033.0, 1677.0, 2082.5999999999995, 2126.0, 0.08424566034556767, 0.026890913904946825, 0.03800927253872292], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 380.11111111111114, 166, 1112, 324.0, 1052.6000000000001, 1112.0, 1112.0, 0.09363295880149813, 18.790522467033394, 0.20658990714731584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 90.53333333333332, 83, 131, 86.0, 111.80000000000001, 131.0, 131.0, 0.07842645167362047, 0.0608877237114534, 0.02787815274335728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9300b563-4497-4069-9436-827dc244f8c5", 3, 0, 0.0, 559.3333333333334, 197, 930, 551.0, 930.0, 930.0, 930.0, 0.02736077923499261, 0.02744093776790763, 0.01754581220473159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8158412b-15cf-4ea7-95c3-03d4fd016aa1", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 308.81249999999994, 162, 895, 324.5, 608.7000000000003, 895.0, 895.0, 0.11313177022937466, 8.62343189865161, 0.2526268887702577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 94.8125, 80, 245, 83.5, 146.3000000000001, 245.0, 245.0, 0.08013542887479841, 0.05955377087277499, 0.04022422894692029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 113.3125, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.08007246558135112, 0.02142564020438497, 0.045666328026864315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/998fc4c4-2f50-4741-81c7-6ac586799324", 3, 0, 0.0, 859.3333333333334, 193, 1991, 394.0, 1991.0, 1991.0, 1991.0, 0.022307818146666467, 0.02636708583676626, 0.01430546931931411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 104.0, 79, 246, 82.0, 243.9, 246.0, 246.0, 0.08013743570222932, 0.021599543216616498, 0.04711204716088091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd2fc70b-76d4-4872-bdd5-dcdd92ea855d", 3, 0, 0.0, 369.3333333333333, 298, 434, 376.0, 434.0, 434.0, 434.0, 0.07724592527744162, 0.03495176957540489, 0.04953596119679687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 104.125, 80, 242, 82.0, 239.9, 242.0, 242.0, 0.08013703432870208, 0.021599435033907984, 0.04719007001973375], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 912.3636363636361, 642, 1471, 874.0, 1255.0, 1338.9999999999993, 1471.0, 0.23960443486026706, 286.6502040721863, 0.47312516336666016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1124.2380952380956, 88, 2126, 1033.0, 1677.0, 2082.5999999999995, 2126.0, 0.08772882602120531, 0.028002727948732944, 0.03958077892753599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 161.5, 82, 241, 161.5, 241.0, 241.0, 241.0, 0.3351206434316354, 0.09032548592493297, 0.19734155077077747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 161.0, 82, 240, 161.0, 240.0, 240.0, 240.0, 0.3352329869259135, 0.09035576600737512, 0.19708033020449212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 165.86666666666667, 80, 909, 83.0, 565.8000000000002, 909.0, 909.0, 0.07745573404799158, 4.665805334699137, 0.0450917430896576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 149.00000000000003, 80, 479, 83.0, 393.20000000000005, 479.0, 479.0, 0.07745573404799158, 1.5377887969317203, 0.045167383454938835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.6, 81, 105, 83.0, 97.2, 105.0, 105.0, 0.07745453418843139, 0.057561426286519814, 0.03887854548130248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 81.5, 81, 82, 81.5, 82.0, 82.0, 82.0, 0.34435261707988984, 0.0921412276170799, 0.19638860192837465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 96.13333333333334, 80, 241, 81.0, 167.80000000000004, 241.0, 241.0, 0.07745653397501769, 0.02848141301373046, 0.04374075362625673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 0.34435261707988984, 0.2559104898415978, 0.17284887224517906], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 553.3636363636364, 379, 1071, 466.0, 1018.6000000000001, 1071.0, 1071.0, 0.06492433364024837, 0.011729493870552683, 0.044191660690676864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 87.0, 83, 91, 87.0, 91.0, 91.0, 91.0, 0.6697923643670461, 0.5271998492967179, 0.23809025452109844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9ef7ad8-0293-41a5-80b1-fb386837a75d", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1479.7499999999995, 841, 2985, 1358.0, 2640.2000000000016, 2971.5, 2985.0, 0.09060309953203498, 0.04689418237497905, 0.04167388660116063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 244.5, 165, 324, 244.5, 324.0, 324.0, 324.0, 0.3305785123966942, 0.5123321280991736, 0.7434788223140496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d31e8fd3-9d4e-40f2-a7b7-ee50e0b09b1b", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["addBook", 61, 0, 0.0, 928.6229508196723, 504, 1839, 759.0, 1564.0, 1599.5, 1839.0, 0.30799991921313596, 103.8031520762224, 1.120473963277321], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 152.67272727272731, 81, 632, 84.0, 340.4, 343.4, 632.0, 0.24035625166610583, 0.1786241284354556, 0.11618783649875233], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 517.2727272727271, 395, 806, 484.0, 647.4, 653.0, 806.0, 0.24054652169729626, 70.72866427523333, 0.12097798698643318], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 116.29090909090908, 80, 339, 85.0, 244.0, 246.2, 339.0, 0.24097018979688403, 0.42640428116401746, 0.11719058058481274], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 755.3454545454547, 556, 1116, 725.0, 957.8, 969.4, 1116.0, 0.24030059419783292, 216.22289706259832, 0.1206196341969591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 98.0, 84, 245, 87.5, 141.4000000000001, 245.0, 245.0, 0.11307899981624663, 0.08447796372991082, 0.040196050715931415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 0, 0.0, 161.93785310734458, 81, 1436, 92.0, 310.80000000000007, 388.29999999999995, 701.2399999999989, 0.7506616000542852, 1.5264587340219347, 0.3646081278732951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 107.37499999999999, 82, 244, 87.5, 243.3, 244.0, 244.0, 0.0849938113881083, 0.06582040276442372, 0.030212643891866623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 95.6470588235294, 82, 248, 85.0, 127.99999999999989, 248.0, 248.0, 0.11400979142914627, 0.0925216178492388, 0.040526918047079336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22900107-c004-4530-9f9c-6e9965d32726", 3, 0, 0.0, 726.3333333333334, 216, 1071, 892.0, 1071.0, 1071.0, 1071.0, 0.07441029838529652, 0.033668722251159564, 0.04771754160775851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6a1ef17-8c21-4e4c-b244-f47c54556fc2", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 230.5625, 163, 489, 173.5, 380.5000000000001, 489.0, 489.0, 0.0800384184408516, 0.12404391607971826, 0.18000827897390748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 274.8, 162, 991, 170.0, 647.8000000000002, 991.0, 991.0, 0.07742175241555868, 6.286878158162318, 0.17280273034261706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54c68217-2133-44fd-bd17-60502411b3ec", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7de694a1-e353-417b-bd34-a1b7473f04a0", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 103.83333333333333, 81, 242, 89.5, 201.20000000000016, 242.0, 242.0, 0.06160891686390077, 0.05108004923579273, 0.021900044666464728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd2fc70b-76d4-4872-bdd5-dcdd92ea855d", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c813f368-7fd3-49f5-8969-85bfd3165ada", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 89.0, 84, 107, 85.5, 105.60000000000001, 106.95, 107.0, 0.100528781390112, 0.07804724727064358, 0.03573484025976637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc7691cb-aedc-4b6b-8c2b-96d44214189e", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=868e8520-1794-4508-a6a7-e4e156b9115c", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 94.375, 81, 240, 83.0, 146.2000000000001, 240.0, 240.0, 0.11378425083738097, 0.08456036610082708, 0.05711436028360725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 142.625, 81, 245, 84.0, 243.6, 245.0, 245.0, 0.11365977367497566, 0.04108234739399451, 0.06422498685808868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 172.4375, 80, 810, 82.0, 469.10000000000036, 810.0, 810.0, 0.11319900384876612, 6.394645167552214, 0.06594063065995019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 186.31250000000003, 79, 708, 83.0, 442.7000000000003, 708.0, 708.0, 0.11328155422292395, 2.110408251676213, 0.06609934438300492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 100.0, 0.2329192546583851], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
