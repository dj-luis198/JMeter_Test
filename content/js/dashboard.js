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

    var data = {"OkPercent": 97.30909090909091, "KoPercent": 2.690909090909091};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8003754693366708, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cd9e436-794b-4064-b6a6-b3615b21c4ea"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "see books"], "isController": true}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13dadc50-4e42-4e60-a51f-edc92a647176"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c23f108d-cee5-4d92-b26d-80597065d75e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a263db2-e5d6-4b17-babf-df0981f67d0f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/06603f2c-ca08-4b1b-9eec-0267ba9ced77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3090946-e198-45bc-bf01-ed76da05d8d7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a263db2-e5d6-4b17-babf-df0981f67d0f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd7a16a0-0af6-42fa-9da3-15285b331c13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c23f108d-cee5-4d92-b26d-80597065d75e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24a8c61b-3b16-4cd1-9ab3-c2542c8e2127"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9119318181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd7a16a0-0af6-42fa-9da3-15285b331c13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a7b4e89-1e97-4587-a5ac-f52ac6750977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24a8c61b-3b16-4cd1-9ab3-c2542c8e2127"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06603f2c-ca08-4b1b-9eec-0267ba9ced77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3090946-e198-45bc-bf01-ed76da05d8d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13dadc50-4e42-4e60-a51f-edc92a647176"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/179ec781-0999-484d-a575-67acfa5e788e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a826c319-507a-4577-b28b-a1028ee5a6e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b88dc82-fa74-4b1c-9484-dcc387cf2b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cd9e436-794b-4064-b6a6-b3615b21c4ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c707b3aa-c490-447c-93b4-331297a5f524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a7b4e89-1e97-4587-a5ac-f52ac6750977"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c707b3aa-c490-447c-93b4-331297a5f524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a826c319-507a-4577-b28b-a1028ee5a6e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1375, 37, 2.690909090909091, 301.8378181818183, 77, 3556, 93.0, 850.4000000000001, 1077.6000000000001, 1511.44, 5.362254408748079, 777.937482572673, 3.9389376630612816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/2cd9e436-794b-4064-b6a6-b3615b21c4ea", 3, 0, 0.0, 322.3333333333333, 252, 434, 281.0, 434.0, 434.0, 434.0, 0.03416117241143716, 0.028478763849508648, 0.02190674142269896], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1348.2166666666667, 945, 1806, 1341.0, 1645.0, 1680.0, 1806.0, 0.25823333964570383, 310.7421345419909, 1.2697313135899597], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 234.1304347826087, 159, 552, 163.0, 471.8, 536.1999999999998, 552.0, 0.11101189757945797, 0.17204675923691387, 0.2496683594975505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 99.54545454545455, 79, 275, 83.0, 195.2999999999999, 269.2999999999999, 275.0, 0.1180010620095581, 0.09161215263437371, 0.0419456900112101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 279.2222222222223, 158, 855, 169.0, 518.4000000000005, 855.0, 855.0, 0.10048119326999295, 6.82543254885898, 0.22455627784166396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13dadc50-4e42-4e60-a51f-edc92a647176", 3, 0, 0.0, 501.0, 198, 1051, 254.0, 1051.0, 1051.0, 1051.0, 0.08401478660244203, 0.03801450305253725, 0.053876669793883725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 117.4, 80, 262, 81.0, 262.0, 262.0, 262.0, 0.024857318989003122, 0.018473066162725954, 0.012477208945651958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 141.0, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.024838055875690497, 0.0066461204198624965, 0.014165453741604737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 109.8, 78, 234, 79.0, 234.0, 234.0, 234.0, 0.024857566145983515, 0.00669989087528462, 0.014613530097541091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 110.0, 78, 235, 79.0, 235.0, 235.0, 235.0, 0.024838179262107372, 0.006694665504239877, 0.014626388764697993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 88.66666666666667, 81, 99, 86.0, 99.0, 99.0, 99.0, 0.028808757862390167, 0.0084963328851971, 0.01780853879579392], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 936.8499999999998, 619, 1478, 889.0, 1288.8, 1350.85, 1478.0, 0.2513594356142806, 300.7132716734673, 0.4963366980586673], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 576.8666666666668, 81, 2490, 459.0, 1707.6000000000004, 2490.0, 2490.0, 0.07193761569966525, 0.01518839112721448, 0.04797714422053195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 576.8666666666668, 81, 2490, 459.0, 1707.6000000000004, 2490.0, 2490.0, 0.07256788725853036, 0.015321462134076428, 0.04839748939299381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 912.0833333333333, 123, 1785, 928.0, 1519.0, 1732.0, 1785.0, 0.10473991769188135, 0.03242436905109999, 0.04725570505239178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 113.21428571428572, 78, 239, 80.0, 236.5, 239.0, 239.0, 0.07935023493337413, 0.038258148985733965, 0.04430240516229957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 112.2, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.048051973014011956, 0.01295150835143291, 0.02829623020258712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.21428571428571, 78, 239, 81.0, 166.5, 239.0, 239.0, 0.0793493354493156, 0.05896957448918865, 0.03982964689545725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 80.4, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.04805243481687217, 0.012951632821735077, 0.028249575937262742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 179.21428571428572, 77, 620, 81.5, 542.0, 620.0, 620.0, 0.07935113443782556, 3.3514562704400017, 0.045753102487658064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c23f108d-cee5-4d92-b26d-80597065d75e", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 217.64285714285717, 78, 925, 80.0, 813.0, 925.0, 925.0, 0.0793506846830507, 10.218315785260044, 0.04567535226036094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 101.5, 78, 238, 80.0, 236.0, 237.7, 238.0, 0.1124859392575928, 0.030318475815523056, 0.06612942913385826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 108.09090909090911, 77, 237, 80.0, 234.4, 236.7, 237.0, 0.11248536412023663, 0.03031832079803253, 0.06623894000439716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 88.27272727272728, 79, 236, 80.0, 87.1, 213.79999999999967, 236.0, 0.11257573276567873, 0.08366223890105616, 0.056507740860897326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 79.4, 79, 80, 79.0, 80.0, 80.0, 80.0, 0.048052896628608774, 0.012857903980701956, 0.02740516760850344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 108.72727272727273, 78, 237, 80.5, 235.4, 236.85, 237.0, 0.11257630882751775, 0.030122957635488147, 0.0642036761281937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 80.4, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.048051049434919654, 0.035709813105443224, 0.024119374423387407], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 530.9999999999999, 80, 1625, 433.0, 1338.0, 1625.0, 1625.0, 0.08202388066697132, 0.016346416508477755, 0.055813543241232236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 82.8, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.044829379382071835, 0.035285624787060446, 0.015935443452220848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1440.6521739130435, 775, 3556, 1292.0, 1948.0, 3237.1999999999953, 3556.0, 0.09897581547465359, 0.05122771699371719, 0.045525008875548674], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 160.66666666666666, 78, 252, 176.0, 225.60000000000002, 252.0, 252.0, 0.07192243884195285, 0.12486690602853882, 0.046478003121433846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a263db2-e5d6-4b17-babf-df0981f67d0f", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06603f2c-ca08-4b1b-9eec-0267ba9ced77", 3, 0, 0.0, 731.0, 171, 1625, 397.0, 1625.0, 1625.0, 1625.0, 0.04467410242282549, 0.028721143321966253, 0.02864843156672077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 193.6, 160, 320, 163.0, 320.0, 320.0, 320.0, 0.048013674294439056, 0.07441181748561991, 0.10798387880868471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3090946-e198-45bc-bf01-ed76da05d8d7", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a263db2-e5d6-4b17-babf-df0981f67d0f", 3, 0, 0.0, 863.6666666666666, 206, 1942, 443.0, 1942.0, 1942.0, 1942.0, 0.028655210950111278, 0.028739161763441684, 0.018375900251210685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd7a16a0-0af6-42fa-9da3-15285b331c13", 3, 0, 0.0, 345.33333333333337, 176, 628, 232.0, 628.0, 628.0, 628.0, 0.07363589504430426, 0.033318324906114236, 0.04722093529859356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 101.04347826086958, 78, 238, 80.0, 236.6, 237.8, 238.0, 0.11113849305867629, 0.08259413400161392, 0.05578631389859337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 108.08695652173913, 77, 238, 80.0, 236.6, 237.8, 238.0, 0.11113956713554679, 0.02973851698744123, 0.06338428438199152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 530.1, 394, 625, 510.5, 624.8, 625.0, 625.0, 0.05924802407839699, 17.42088629859819, 0.033789888732210775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 821.3000000000001, 553, 1159, 849.0, 1135.4, 1159.0, 1159.0, 0.059110738056675376, 53.18794600899074, 0.0336538674678142], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 881.5862068965515, 406, 2541, 739.5, 1576.9, 1618.6499999999999, 2541.0, 0.2919105545797243, 79.44207730219286, 1.0627172028426048], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 188.5, 79, 238, 233.0, 237.9, 238.0, 238.0, 0.059332039894863624, 0.10498989872020789, 0.03285279943397234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c23f108d-cee5-4d92-b26d-80597065d75e", 3, 0, 0.0, 890.0, 178, 2060, 432.0, 2060.0, 2060.0, 2060.0, 0.04321707938977484, 0.036028300884509555, 0.02771407760346889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 80.8125, 78, 85, 80.0, 85.0, 85.0, 85.0, 0.07338776259058802, 0.05453914778460692, 0.03683721676910375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 99.68749999999999, 78, 236, 80.0, 234.6, 236.0, 236.0, 0.07338910905621605, 0.019637320196682812, 0.04185472625862322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 109.625, 79, 236, 80.5, 234.6, 236.0, 236.0, 0.07338910905621605, 0.019780658300308236, 0.04314476919125202], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 147.88333333333327, 78, 534, 81.0, 322.9, 326.9, 534.0, 0.25241689173839515, 0.1875871627079284, 0.12201793106494686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 80.625, 78, 90, 80.0, 86.5, 90.0, 90.0, 0.07338877243517707, 0.019780567570418822, 0.04321624001798025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24a8c61b-3b16-4cd1-9ab3-c2542c8e2127", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 492.19999999999993, 385, 719, 465.5, 638.6, 705.0, 719.0, 0.2526017985248055, 74.27331593538446, 0.1270409435940184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 111.89999999999999, 78, 239, 81.0, 238.6, 239.0, 239.0, 0.05938453864151929, 0.04413245498651971, 0.033345810272337496], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 125.99999999999997, 78, 329, 82.0, 237.9, 239.89999999999998, 329.0, 0.25293296854778535, 0.4475727920005733, 0.12300841634452842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 689.2666666666668, 79, 1118, 868.0, 1090.4, 1118.0, 1118.0, 0.1333048949557428, 79.97729581578152, 0.07073143840425154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 113.91304347826086, 78, 240, 80.0, 235.6, 239.2, 240.0, 0.11105477897684748, 0.029932733396103427, 0.06528806342193573], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 787.0333333333333, 538, 1150, 773.0, 996.3, 1074.1499999999999, 1150.0, 0.25196427146630607, 226.71789437132816, 0.12647425345086066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 428.6666666666667, 78, 715, 615.0, 688.0, 715.0, 715.0, 0.13330607964593905, 26.142919114314406, 0.07086224871803987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 84.22222222222221, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.10472605409682506, 0.07823772596100699, 0.03722683954223078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 103.8695652173913, 78, 315, 79.0, 232.6, 298.5999999999998, 315.0, 0.11113956713554679, 0.029955586454502844, 0.06544644431907687], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 362.7142857142858, 81, 698, 401.0, 647.5, 698.0, 698.0, 0.0819609748672525, 0.016814120192842466, 0.05525619573744388], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, 7.386363636363637, 155.34659090909096, 79, 1309, 85.5, 287.0, 390.3, 1205.0499999999986, 0.7181357847877623, 1.6133708735244554, 0.3414874642462226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 83.6, 82, 88, 82.0, 88.0, 88.0, 88.0, 0.024510765128044235, 0.018981481197792072, 0.008712811041609475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 192.06249999999997, 160, 315, 164.5, 315.0, 315.0, 315.0, 0.0733605072879079, 0.11369445807217757, 0.16498950027739442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd7a16a0-0af6-42fa-9da3-15285b331c13", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 110.28571428571429, 80, 250, 84.5, 248.5, 250.0, 250.0, 0.07890969349220485, 0.06403706571486546, 0.02804993010855719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 502.0869565217391, 103, 1281, 466.0, 1088.6000000000004, 1256.9999999999995, 1281.0, 0.10137875101378752, 0.06227268983171127, 0.04583824386658556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 92.46666666666665, 78, 234, 81.0, 159.00000000000006, 234.0, 234.0, 0.1333048949557428, 0.09906740728644556, 0.06691280860083182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 111.8, 78, 245, 80.0, 241.4, 245.0, 245.0, 0.13330371028660298, 0.1691464396800711, 0.06856115307709397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a7b4e89-1e97-4587-a5ac-f52ac6750977", 3, 0, 0.0, 264.3333333333333, 173, 412, 208.0, 412.0, 412.0, 412.0, 0.016790167677807877, 0.02314660160010298, 0.010767132267344244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24a8c61b-3b16-4cd1-9ab3-c2542c8e2127", 3, 0, 0.0, 314.3333333333333, 179, 407, 357.0, 407.0, 407.0, 407.0, 0.018847535998793758, 0.0259828499202121, 0.012086473280476465], "isController": false}, {"data": ["login", 23, 0, 0.0, 2653.869565217391, 1086, 4036, 2496.0, 3935.2, 4016.3999999999996, 4036.0, 0.09979650191565895, 52.04023168517241, 0.2225209450620257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06603f2c-ca08-4b1b-9eec-0267ba9ced77", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 260.0, 159, 499, 162.0, 499.0, 499.0, 499.0, 0.02482806564540557, 0.03847865251880726, 0.05583890154430569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 97.0, 80, 239, 82.0, 178.8000000000002, 238.39999999999998, 239.0, 0.11328654106637114, 0.09171342045314616, 0.04026982514468661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3090946-e198-45bc-bf01-ed76da05d8d7", 3, 0, 0.0, 404.66666666666663, 172, 793, 249.0, 793.0, 793.0, 793.0, 0.028002314858028263, 0.028084352889838893, 0.017957213629660053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 226.2272727272727, 160, 473, 165.0, 319.7, 450.04999999999967, 473.0, 0.1124393721794328, 0.17425906606324204, 0.2528787833293298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13dadc50-4e42-4e60-a51f-edc92a647176", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/179ec781-0999-484d-a575-67acfa5e788e", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 96.31250000000001, 81, 238, 84.0, 147.7000000000001, 238.0, 238.0, 0.0738572892528412, 0.0612351939215451, 0.026253958289095897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 782.9333333333334, 159, 1200, 952.0, 1173.0, 1200.0, 1200.0, 0.1332090049287332, 106.31166987200834, 0.27686832567381553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a826c319-507a-4577-b28b-a1028ee5a6e7", 3, 0, 0.0, 327.0, 177, 567, 237.0, 567.0, 567.0, 567.0, 0.0255052158166345, 0.025430493504671706, 0.016355883840745433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b88dc82-fa74-4b1c-9484-dcc387cf2b4a", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 87.46666666666667, 80, 103, 84.0, 99.4, 103.0, 103.0, 0.13223315349624457, 0.10266148147413519, 0.047004753781868185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cd9e436-794b-4064-b6a6-b3615b21c4ea", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c707b3aa-c490-447c-93b4-331297a5f524", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a7b4e89-1e97-4587-a5ac-f52ac6750977", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 345.2857142857143, 159, 1005, 315.5, 893.0, 1005.0, 1005.0, 0.07931337280117837, 13.660555583094922, 0.17547862433787498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 582.6470588235294, 78, 1399, 640.0, 1150.9999999999998, 1399.0, 1399.0, 0.0990624034869966, 69.72448769805196, 0.15832457432302502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c707b3aa-c490-447c-93b4-331297a5f524", 3, 0, 0.0, 286.0, 208, 397, 253.0, 397.0, 397.0, 397.0, 0.026354396352551542, 0.03115000428258941, 0.01690044297347869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 97.88888888888889, 79, 240, 80.0, 237.3, 240.0, 240.0, 0.10052608651945179, 0.07470737484502228, 0.050459383272459205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a826c319-507a-4577-b28b-a1028ee5a6e7", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 140.38888888888889, 78, 239, 80.0, 237.2, 239.0, 239.0, 0.10052889367952506, 0.0352876487688003, 0.05686383710409767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 162.44444444444443, 78, 775, 80.0, 298.00000000000074, 775.0, 775.0, 0.10052945513035319, 5.050956085732078, 0.05862036587136698], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 912.0833333333333, 123, 1785, 928.0, 1519.0, 1732.0, 1785.0, 0.10262243069778977, 0.031768857940624375, 0.04630035447497937], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 136.2222222222222, 77, 619, 80.0, 282.40000000000055, 619.0, 619.0, 0.10053057805082379, 1.6677756736944986, 0.05871919505724658], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.7272727272727273], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2909090909090909], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.21818181818181817], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.4545454545454546], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1375, 37, "401/Unauthorized", 20, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
