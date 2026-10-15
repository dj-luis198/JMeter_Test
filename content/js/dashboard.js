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

    var data = {"OkPercent": 98.89502762430939, "KoPercent": 1.1049723756906078};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.76797829036635, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e7f6f76-670c-4faf-8dd4-26c79a681909"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e32ae87f-3669-4359-ba2b-ab09cf423408"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dbec51b-a7b5-482a-b59a-def2d755f97a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be183776-6e67-48e0-b374-72417be586db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=294a5520-0205-4d34-bf63-9c1f8d9c3959"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/842f47d7-24cd-407d-98c0-195e8c282b24"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/126cce21-eeab-4b08-9f0d-480bb4e63754"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8fdd8c3-369d-404f-9938-0a359a35c063"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34f076d5-a29a-40f2-9349-73cec195c57f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d0307a0-488f-4b2e-a86c-51c5a5f02f3b"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f1715ba-4afb-42a0-ba33-f797163c82c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54ce2f21-d8b7-4986-8ec9-050194aa4f60"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=408e26c7-49ca-43c2-9452-babdc50ec374"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/eb8ad7cb-a7d4-4920-b8cc-961f46649912"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e7f6f76-670c-4faf-8dd4-26c79a681909"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e32ae87f-3669-4359-ba2b-ab09cf423408"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8fdd8c3-369d-404f-9938-0a359a35c063"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/294a5520-0205-4d34-bf63-9c1f8d9c3959"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0fb39ab-4ac9-4ed2-9445-040ba448ff7e"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9467455621301775, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0d0307a0-488f-4b2e-a86c-51c5a5f02f3b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be183776-6e67-48e0-b374-72417be586db"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34f076d5-a29a-40f2-9349-73cec195c57f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=842f47d7-24cd-407d-98c0-195e8c282b24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/408e26c7-49ca-43c2-9452-babdc50ec374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=126cce21-eeab-4b08-9f0d-480bb4e63754"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f1715ba-4afb-42a0-ba33-f797163c82c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c51d9bb1-056a-4ae1-9f97-74386f97373c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54ce2f21-d8b7-4986-8ec9-050194aa4f60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1267, 14, 1.1049723756906078, 409.98579321231193, 108, 4555, 134.0, 1111.2, 1351.3999999999996, 2090.7999999999975, 5.0596414722877805, 710.3484496736392, 3.6967289412889905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1803.5272727272725, 1335, 2565, 1795.0, 2155.8, 2279.0, 2565.0, 0.2515481646131189, 302.69610233979813, 1.2368603601826698], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4e7f6f76-670c-4faf-8dd4-26c79a681909", 3, 0, 0.0, 579.6666666666666, 250, 928, 561.0, 928.0, 928.0, 928.0, 0.07330124367776773, 0.03245107141984509, 0.04700633139492267], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 632.9285714285714, 126, 1117, 619.0, 1106.5, 1117.0, 1117.0, 0.0824280962053637, 0.016237231004739616, 0.0554618733256793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 632.9285714285714, 126, 1117, 619.0, 1106.5, 1117.0, 1117.0, 0.08134663544505326, 0.016024197718807923, 0.05473421076332196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 155.6875, 109, 346, 112.5, 344.6, 346.0, 346.0, 0.0950779341941848, 0.025440775360553357, 0.05422413434512102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 129.68749999999997, 111, 353, 114.5, 190.60000000000016, 353.0, 353.0, 0.0950779341941848, 0.07065850382985804, 0.04772466618731542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 184.0625, 109, 350, 116.0, 346.5, 350.0, 350.0, 0.09507962918944617, 0.02562693130496791, 0.05598927382933207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 197.25, 110, 347, 114.0, 344.9, 347.0, 347.0, 0.09508019420129665, 0.02562708359331824, 0.05589675479412167], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 336.28571428571433, 115, 1944, 233.0, 1100.5, 1944.0, 1944.0, 0.08292315984623677, 0.16249144854914085, 0.053596958645035574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e32ae87f-3669-4359-ba2b-ab09cf423408", 1, 0, 0.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 0.17157080959164295, 0.6547513057929725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 142.61111111111111, 112, 373, 115.0, 340.6, 373.0, 373.0, 0.09948159037902486, 0.07393114285003703, 0.049935095170721464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 175.33333333333334, 111, 340, 115.0, 337.3, 340.0, 340.0, 0.09948378966916112, 0.03492079639537069, 0.05627267746802701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 798.75, 658, 883, 827.0, 883.0, 883.0, 883.0, 0.06774838250736763, 19.920273915179024, 0.0386377493987331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1207.0, 1014, 1331, 1241.5, 1331.0, 1331.0, 1331.0, 0.0673343994613248, 60.58761099654911, 0.038335893443312855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 166.75, 109, 334, 112.0, 334.0, 334.0, 334.0, 0.06864478042250863, 0.1214690841070172, 0.0380093657222289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 138.4, 111, 341, 115.0, 319.5000000000001, 341.0, 341.0, 0.054541091258153894, 0.040532978952592884, 0.027377071197940528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dbec51b-a7b5-482a-b59a-def2d755f97a", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 179.5, 110, 341, 115.5, 340.4, 341.0, 341.0, 0.05447631914406807, 0.01457667133347134, 0.03106852576185132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 135.9, 109, 340, 114.0, 317.70000000000005, 340.0, 340.0, 0.054543471146503764, 0.014701169957456092, 0.032065595341987566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 159.5, 110, 340, 116.5, 339.4, 340.0, 340.0, 0.05447631914406807, 0.014683070394299598, 0.032079316839719776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 113.0, 110, 117, 112.5, 117.0, 117.0, 117.0, 0.06864595846919513, 0.05101520937017333, 0.038546314570104684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1121.7142857142856, 112, 4442, 1124.0, 2937.0, 4442.0, 4442.0, 0.09039372925786748, 58.10441575385143, 0.047592903769418514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 190.5, 111, 1248, 115.0, 429.0000000000013, 1248.0, 1248.0, 0.09948104057168437, 4.998280022894456, 0.05800901823266405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 606.7142857142858, 110, 913, 683.0, 913.0, 913.0, 913.0, 0.09039431290637086, 18.991910717859977, 0.04768148676046152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 176.0, 109, 556, 115.0, 363.4000000000003, 556.0, 556.0, 0.09948378966916112, 1.6504097315872086, 0.058107773414615274], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 548.6923076923076, 120, 1053, 516.0, 1045.0, 1053.0, 1053.0, 0.0771055753262159, 0.014607892200474497, 0.052737850311387904], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 321.4, 227, 681, 233.5, 658.6000000000001, 681.0, 681.0, 0.05444161952929776, 0.0843738771415972, 0.12244047829684838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 721.0500000000002, 168, 1989, 568.0, 1768.6000000000008, 1980.0, 1989.0, 0.09511897005179228, 0.05842757047126693, 0.043007893685527175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 114.07142857142857, 110, 118, 115.0, 117.5, 118.0, 118.0, 0.09039314561690093, 0.06717693731881018, 0.04537312192098348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 259.5714285714285, 109, 367, 331.5, 359.5, 367.0, 367.0, 0.0903954802259887, 0.12116626311541566, 0.046130952380952384], "isController": false}, {"data": ["login", 20, 0, 0.0, 3240.75, 2018, 4683, 3153.5, 4582.100000000001, 4680.5, 4683.0, 0.09297611908381333, 22.375338636458725, 0.17111600979038533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/be183776-6e67-48e0-b374-72417be586db", 3, 0, 0.0, 648.3333333333334, 239, 1194, 512.0, 1194.0, 1194.0, 1194.0, 0.04198799143444974, 0.03500366082800319, 0.02692589294461784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 119.94444444444446, 112, 150, 118.5, 126.60000000000004, 150.0, 150.0, 0.10086011262712577, 0.0816533528983274, 0.035852618160423615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=294a5520-0205-4d34-bf63-9c1f8d9c3959", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/842f47d7-24cd-407d-98c0-195e8c282b24", 3, 0, 0.0, 424.6666666666667, 238, 657, 379.0, 657.0, 657.0, 657.0, 0.07617499936520834, 0.03446720348881497, 0.04884920206688165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/126cce21-eeab-4b08-9f0d-480bb4e63754", 3, 0, 0.0, 1116.6666666666667, 257, 2172, 921.0, 2172.0, 2172.0, 2172.0, 0.03266514955194303, 0.027231591146655635, 0.02094737780511972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8fdd8c3-369d-404f-9938-0a359a35c063", 3, 0, 0.0, 378.6666666666667, 231, 493, 412.0, 493.0, 493.0, 493.0, 0.01666148309414849, 0.02296919951292931, 0.010684609926911627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34f076d5-a29a-40f2-9349-73cec195c57f", 3, 0, 0.0, 430.3333333333333, 223, 649, 419.0, 649.0, 649.0, 649.0, 0.022208732473608623, 0.0222737971195274, 0.014241928051109697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d0307a0-488f-4b2e-a86c-51c5a5f02f3b", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1236.9285714285713, 223, 4555, 1238.5, 3052.0, 4555.0, 4555.0, 0.09032782548664116, 77.22819893574464, 0.18664138159635074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f1715ba-4afb-42a0-ba33-f797163c82c1", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54ce2f21-d8b7-4986-8ec9-050194aa4f60", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=408e26c7-49ca-43c2-9452-babdc50ec374", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 373.8125, 227, 697, 450.0, 536.0000000000002, 697.0, 697.0, 0.09501300490504637, 0.14725160037530138, 0.21368647489875178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 804.0000000000001, 115, 1442, 1132.0, 1442.0, 1442.0, 1442.0, 0.10254907705830647, 70.1171016609288, 0.1610054845443891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8ad7cb-a7d4-4920-b8cc-961f46649912", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.4897790452453988, 0.9151528949386503], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1313.0909090909088, 229, 2717, 1252.0, 2285.0999999999995, 2678.4499999999994, 2717.0, 0.08785381125806657, 0.027922287313909656, 0.03963716875119801], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 408.2222222222222, 228, 1361, 242.5, 776.9000000000009, 1361.0, 1361.0, 0.0994173041341029, 6.753165258830189, 0.22217868879622213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 143.47368421052633, 113, 342, 119.0, 342.0, 342.0, 342.0, 0.12186830526086231, 0.09461455340076713, 0.04332037413569715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e7f6f76-670c-4faf-8dd4-26c79a681909", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 440.6842105263157, 226, 1358, 259.0, 1253.0, 1358.0, 1358.0, 0.09001582383429507, 11.460634621921695, 0.20002334045168993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 113.54545454545455, 112, 118, 113.0, 117.2, 118.0, 118.0, 0.052650220652288374, 0.039127751871476026, 0.026427942788355686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 153.36363636363635, 108, 345, 114.0, 342.2, 345.0, 345.0, 0.052651228688218574, 0.014088317051339734, 0.030027653861249653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 134.1818181818182, 111, 347, 113.0, 300.60000000000014, 347.0, 347.0, 0.052649968649336853, 0.014190811862516573, 0.030952422975489047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 144.8181818181818, 111, 458, 113.0, 389.80000000000024, 458.0, 458.0, 0.052563673722941656, 0.014167552683136617, 0.030953022709896305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.457682291666667, 5.1513671875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e32ae87f-3669-4359-ba2b-ab09cf423408", 3, 0, 0.0, 356.33333333333337, 215, 613, 241.0, 613.0, 613.0, 613.0, 0.02301072299691656, 0.02719789557350392, 0.014756225359350792], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1227.8545454545454, 869, 2078, 1129.0, 1690.3999999999999, 1791.8, 2078.0, 0.2546437765061022, 304.6424852017242, 0.5028219883743541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1313.0909090909088, 229, 2717, 1252.0, 2285.0999999999995, 2678.4499999999994, 2717.0, 0.08888960718874496, 0.028251490921138756, 0.04010449074335955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 114.4, 112, 118, 115.0, 118.0, 118.0, 118.0, 0.03419972640218878, 0.009217895006839946, 0.020139096699726404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 113.2, 110, 117, 112.0, 117.0, 117.0, 117.0, 0.03419902464381716, 0.009217705861028843, 0.02010528597224407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8fdd8c3-369d-404f-9938-0a359a35c063", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 271.3684210526316, 110, 1132, 116.0, 997.0, 1132.0, 1132.0, 0.12177769801694632, 11.563661194414891, 0.07049035953263001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 231.5263157894737, 110, 920, 114.0, 879.0, 920.0, 920.0, 0.12177769801694632, 3.7984927606363206, 0.0706092830658497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 126.00000000000001, 111, 346, 114.0, 117.0, 346.0, 346.0, 0.12177457603219977, 0.0904984886333047, 0.06112512898491277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 112.6, 110, 114, 113.0, 114.0, 114.0, 114.0, 0.03419949247953161, 0.009151036073624668, 0.01950439805473287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 149.57894736842107, 110, 357, 114.0, 336.0, 357.0, 357.0, 0.12177535651337926, 0.05183714548950488, 0.06837345777920205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 115.2, 111, 121, 115.0, 121.0, 121.0, 121.0, 0.034199960328046015, 0.02541618145472951, 0.017166776961538722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 205.6, 116, 348, 117.0, 348.0, 348.0, 348.0, 0.033305134985712095, 0.02621478398289448, 0.011838934701952346], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 617.3333333333334, 115, 993, 611.5, 973.5000000000001, 993.0, 993.0, 0.07600805685402652, 0.014282438417638937, 0.05172976720949088], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1786.3000000000002, 1151, 3073, 1574.0, 2558.2000000000003, 3047.6499999999996, 3073.0, 0.0952281189589662, 0.04928799125805868, 0.04380121487272762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 230.8, 224, 236, 231.0, 236.0, 236.0, 236.0, 0.03417284625636469, 0.05296123731333083, 0.07685553215664832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/294a5520-0205-4d34-bf63-9c1f8d9c3959", 3, 0, 0.0, 533.3333333333334, 241, 993, 366.0, 993.0, 993.0, 993.0, 0.02818356897928508, 0.028266138029029077, 0.01807344755507539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0fb39ab-4ac9-4ed2-9445-040ba448ff7e", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["addBook", 57, 4, 7.017543859649122, 1300.5087719298247, 587, 5033, 1068.0, 1974.8000000000002, 2464.3999999999983, 5033.0, 0.2680170966695349, 85.39917447354624, 0.9749094340254757], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 202.49090909090907, 110, 473, 117.0, 460.2, 468.79999999999995, 473.0, 0.25607956159179057, 0.19030912731577404, 0.12378845994915658], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 715.6727272727272, 536, 1145, 669.0, 917.0, 1047.7999999999997, 1145.0, 0.25557383295694275, 75.14719273926357, 0.12853566794221244], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 206.61818181818182, 112, 469, 124.0, 349.8, 378.5999999999996, 469.0, 0.2563935221011216, 0.4536963496555003, 0.12469138086558453], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1020.581818181818, 756, 1629, 995.0, 1262.3999999999999, 1324.1999999999998, 1629.0, 0.2552204176334107, 229.64778041618328, 0.1281086861948956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 120.94736842105264, 113, 135, 120.0, 130.0, 135.0, 135.0, 0.08933693188764236, 0.06674096962309219, 0.03175648750693537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, 2.366863905325444, 212.69822485207092, 111, 2264, 123.0, 371.0, 524.0, 1719.4000000000087, 0.7081678148204019, 1.5194491454844874, 0.3406862706583865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 160.0, 115, 352, 119.0, 348.40000000000003, 352.0, 352.0, 0.05538910848712203, 0.042894104521765404, 0.01968909715753166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 124.62500000000001, 115, 151, 119.5, 141.20000000000002, 151.0, 151.0, 0.09307195625618056, 0.07553007387586529, 0.03308417195043918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d0307a0-488f-4b2e-a86c-51c5a5f02f3b", 3, 0, 0.0, 1215.6666666666667, 436, 1944, 1267.0, 1944.0, 1944.0, 1944.0, 0.027016804452369373, 0.027095955246663424, 0.017325229417697808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 302.09090909090907, 224, 572, 231.0, 549.8000000000001, 572.0, 572.0, 0.05253480430785395, 0.08141868597320726, 0.11815200617283951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be183776-6e67-48e0-b374-72417be586db", 1, 0, 0.0, 832.0, 832, 832, 832.0, 832.0, 832.0, 832.0, 1.201923076923077, 0.2171443058894231, 0.8286696213942308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 423.2105263157895, 223, 1246, 236.0, 1109.0, 1246.0, 1246.0, 0.12168410805548795, 15.492577219374033, 0.27039314574233714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34f076d5-a29a-40f2-9349-73cec195c57f", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=842f47d7-24cd-407d-98c0-195e8c282b24", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/408e26c7-49ca-43c2-9452-babdc50ec374", 2, 0, 0.0, 224.0, 213, 235, 224.0, 235.0, 235.0, 235.0, 0.03875668552825362, 0.03425273476862259, 0.024090459315169368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 119.0, 112, 127, 116.0, 127.0, 127.0, 127.0, 0.055094900966915515, 0.04567926847745241, 0.019584515578083248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=126cce21-eeab-4b08-9f0d-480bb4e63754", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 138.5, 115, 339, 119.5, 249.0, 339.0, 339.0, 0.08864350116502887, 0.06881990568964644, 0.03150999455475636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f1715ba-4afb-42a0-ba33-f797163c82c1", 3, 0, 0.0, 307.6666666666667, 206, 481, 236.0, 481.0, 481.0, 481.0, 0.025212838377301722, 0.025286704114735225, 0.01616838919377747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c51d9bb1-056a-4ae1-9f97-74386f97373c", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ce2f21-d8b7-4986-8ec9-050194aa4f60", 3, 0, 0.0, 374.0, 198, 610, 314.0, 610.0, 610.0, 610.0, 0.019698869941494355, 0.023283397382020184, 0.012632413341387982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 128.3684210526316, 111, 345, 116.0, 135.0, 345.0, 345.0, 0.09006959061000816, 0.06693648286544551, 0.04521071247416425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 138.05263157894737, 110, 335, 115.0, 331.0, 335.0, 335.0, 0.09007386056566384, 0.038342501706662625, 0.05057395419507154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 296.7894736842105, 111, 1243, 116.0, 1136.0, 1243.0, 1243.0, 0.09007983918378183, 8.553723364221236, 0.052142225991352334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 255.57894736842107, 109, 906, 119.0, 899.0, 906.0, 906.0, 0.09007941211331041, 2.809759096835368, 0.05222994695981984], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 28.571428571428573, 0.31570639305445936], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 14.285714285714286, 0.15785319652722968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07892659826361484], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5524861878453039], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1267, 14, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
