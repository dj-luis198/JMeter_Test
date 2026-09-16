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

    var data = {"OkPercent": 97.69762087490406, "KoPercent": 2.3023791250959325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7164813603662524, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05257362-2ca3-4572-a826-4fa9b7f3043d"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a328f10c-52aa-4c5d-92b2-1f8c14b0e524"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d475431-a3d1-47e0-bbd5-abf8f2ceab72"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2451db5-c1f0-4c26-b699-bdebd4df7a59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05bd511f-44f8-4ca3-85de-233d3686f89a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14f71f5b-beb8-4a6a-a7ec-45a9a062f0b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62172bbc-f2fc-4696-996d-efefbb375c89"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3eb8b1c3-0038-42e6-ad2a-8816010b2063"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9b0bf58-3728-40df-849c-485ba3d4a14d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e32300dc-5b77-4483-a0d0-0b3f5f2e7cef"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad3e248d-108b-4439-8a6f-554f737b3937"], "isController": false}, {"data": [0.1346153846153846, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e7fd851-c9bd-45d2-8b4d-d539b1ae30cb"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecc95dae-5be5-4fe2-ba65-7b846d9bff46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e32300dc-5b77-4483-a0d0-0b3f5f2e7cef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a820c2b6-f894-497b-8309-b05234a55214"], "isController": false}, {"data": [0.1346153846153846, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2388a164-adbe-400e-8072-e7c08a914537"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9127906976744186, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a328f10c-52aa-4c5d-92b2-1f8c14b0e524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9b0bf58-3728-40df-849c-485ba3d4a14d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14f71f5b-beb8-4a6a-a7ec-45a9a062f0b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05257362-2ca3-4572-a826-4fa9b7f3043d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d475431-a3d1-47e0-bbd5-abf8f2ceab72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecc95dae-5be5-4fe2-ba65-7b846d9bff46"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3eb8b1c3-0038-42e6-ad2a-8816010b2063"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a820c2b6-f894-497b-8309-b05234a55214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f07c21a-0a2f-4f27-98d5-60e213ab9155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39ab40e0-f4b5-4979-8948-ecd2367007be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e7fd851-c9bd-45d2-8b4d-d539b1ae30cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2451db5-c1f0-4c26-b699-bdebd4df7a59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62172bbc-f2fc-4696-996d-efefbb375c89"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad3e248d-108b-4439-8a6f-554f737b3937"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 30, 2.3023791250959325, 485.0590943975446, 139, 2590, 158.0, 1422.8000000000004, 1715.8, 2075.080000000001, 5.04333084327743, 697.8423827875531, 3.6753019515329326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2377.703703703704, 1729, 3183, 2322.0, 2877.0, 3045.0, 3183.0, 0.22814941251526277, 274.54052748196983, 1.1218088789202618], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 556.125, 147, 857, 578.0, 832.5, 857.0, 857.0, 0.08933157647899592, 0.01805278623791232, 0.05991605797898474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 556.125, 147, 857, 578.0, 832.5, 857.0, 857.0, 0.08868982949380279, 0.017923097256712713, 0.05948562843673089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 194.64705882352945, 139, 429, 145.0, 427.4, 429.0, 429.0, 0.08874411417713325, 0.04726766007872125, 0.0492966213288648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 162.1764705882353, 142, 429, 145.0, 206.5999999999998, 429.0, 429.0, 0.08874318765530058, 0.06595074785711302, 0.04454492036603955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 338.47058823529414, 142, 1159, 145.0, 1150.2, 1159.0, 1159.0, 0.08874457744530463, 4.62449583618273, 0.050912919057114966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 437.9411764705882, 141, 1761, 145.0, 1691.3999999999999, 1761.0, 1761.0, 0.08874411417713325, 14.111247068507845, 0.05082598910535492], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 274.81250000000006, 141, 484, 259.5, 474.90000000000003, 484.0, 484.0, 0.0896680042143962, 0.16051470310083166, 0.05795254496009774], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 179.47058823529412, 142, 437, 146.0, 433.8, 437.0, 437.0, 0.1046591804570528, 0.07777894172638397, 0.05253400269035658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 203.41176470588235, 141, 573, 144.0, 461.7999999999999, 573.0, 573.0, 0.10466240218682854, 0.02800536933514748, 0.059690276247175655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1098.8333333333333, 850, 1190, 1141.0, 1190.0, 1190.0, 1190.0, 0.07026172492534692, 20.659280036887406, 0.04007113999648691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1575.0, 1278, 1723, 1586.0, 1723.0, 1723.0, 1723.0, 0.06955070246209487, 62.58184433248713, 0.03959771439004034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 293.16666666666663, 145, 438, 297.0, 438.0, 438.0, 438.0, 0.0706023557652707, 0.12493307485026417, 0.03909329660049657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 169.33333333333334, 143, 432, 146.0, 346.8000000000003, 432.0, 432.0, 0.08108217678617279, 0.06025735989675537, 0.04069945201962189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 168.83333333333334, 142, 433, 145.0, 347.50000000000034, 433.0, 433.0, 0.08108272464982398, 0.02169596343169118, 0.046242491401852735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 240.41666666666669, 140, 437, 147.5, 435.8, 437.0, 437.0, 0.0810849161784679, 0.021854918813727676, 0.04766906205023211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 192.41666666666666, 141, 435, 146.0, 431.40000000000003, 435.0, 435.0, 0.08108327252087895, 0.021854475796643152, 0.047747278642666015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 145.16666666666669, 144, 146, 145.0, 146.0, 146.0, 146.0, 0.07084661707403471, 0.052650659759121504, 0.039782035954658165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1217.9285714285716, 140, 2154, 1575.0, 1944.5, 2154.0, 2154.0, 0.0778777208528723, 50.05921879258938, 0.04100314153163226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 179.47058823529412, 142, 428, 145.0, 424.8, 428.0, 428.0, 0.10466175782500554, 0.028209614413771025, 0.06152966622134115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05257362-2ca3-4572-a826-4fa9b7f3043d", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 828.2857142857144, 141, 1274, 1070.0, 1269.0, 1274.0, 1274.0, 0.0778777208528723, 16.362165647302927, 0.041079193993402645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 179.82352941176472, 139, 430, 145.0, 426.0, 430.0, 430.0, 0.10466175782500554, 0.028209614413771025, 0.06163187496921713], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 497.8125, 146, 807, 537.5, 782.5, 807.0, 807.0, 0.0887316367104964, 0.017931545968533545, 0.05999025511731986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a328f10c-52aa-4c5d-92b2-1f8c14b0e524", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 435.50000000000006, 289, 866, 294.5, 781.4000000000003, 866.0, 866.0, 0.08100226806350579, 0.1255376947429528, 0.18217599936548223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 571.9999999999999, 155, 1080, 480.0, 1043.8, 1075.3999999999999, 1080.0, 0.10192640913260625, 0.06260909310977475, 0.046085866629293655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 145.28571428571428, 143, 148, 145.5, 147.5, 148.0, 148.0, 0.07787815406523964, 0.05787624535512438, 0.03909118280227849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 247.42857142857144, 143, 440, 146.0, 438.5, 440.0, 440.0, 0.0778777208528723, 0.10438743609854868, 0.03974284359372306], "isController": false}, {"data": ["login", 23, 0, 0.0, 2862.652173913044, 1587, 4517, 2655.0, 4112.2, 4446.5999999999985, 4517.0, 0.09919736393787658, 31.094262834198076, 0.19257817048792164], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d475431-a3d1-47e0-bbd5-abf8f2ceab72", 3, 0, 0.0, 485.0, 251, 720, 484.0, 720.0, 720.0, 720.0, 0.04247907905356612, 0.027309954795180037, 0.02724081566911629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2451db5-c1f0-4c26-b699-bdebd4df7a59", 3, 0, 0.0, 399.33333333333337, 246, 693, 259.0, 693.0, 693.0, 693.0, 0.04753152924773433, 0.030124963361112873, 0.030480830930350467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05bd511f-44f8-4ca3-85de-233d3686f89a", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 152.64705882352945, 145, 171, 149.0, 171.0, 171.0, 171.0, 0.10812529813960883, 0.0875350314040388, 0.03843516457306408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14f71f5b-beb8-4a6a-a7ec-45a9a062f0b9", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62172bbc-f2fc-4696-996d-efefbb375c89", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1365.1428571428573, 289, 2301, 1721.5, 2091.5, 2301.0, 2301.0, 0.0778140910202539, 66.52924576607973, 0.16078466826185553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3eb8b1c3-0038-42e6-ad2a-8816010b2063", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9b0bf58-3728-40df-849c-485ba3d4a14d", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e32300dc-5b77-4483-a0d0-0b3f5f2e7cef", 3, 0, 0.0, 580.3333333333334, 278, 1012, 451.0, 1012.0, 1012.0, 1012.0, 0.025506733777717318, 0.025581460536831725, 0.016356857272820026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 636.0588235294118, 289, 1908, 295.0, 1837.6, 1908.0, 1908.0, 0.08867560377653748, 18.834386491967035, 0.1954296610114235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 932.1666666666667, 141, 1868, 784.5, 1862.6, 1868.0, 1868.0, 0.12689550155446988, 75.92254516686758, 0.1851075736787006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad3e248d-108b-4439-8a6f-554f737b3937", 3, 0, 0.0, 427.0, 263, 523, 495.0, 523.0, 523.0, 523.0, 0.02373061011398603, 0.028048777774701588, 0.015217871720231927], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 1310.6923076923076, 224, 2500, 1354.5, 1939.8000000000002, 2329.899999999999, 2500.0, 0.10124176923885658, 0.031729316501240216, 0.045677438855812255], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0e7fd851-c9bd-45d2-8b4d-d539b1ae30cb", 3, 0, 0.0, 463.33333333333337, 243, 891, 256.0, 891.0, 891.0, 891.0, 0.04885038754640787, 0.03140609225395688, 0.03132658315964307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 420.29411764705884, 288, 867, 295.0, 866.2, 867.0, 867.0, 0.10456583649593731, 0.1620566235537622, 0.2351710170411559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 167.3684210526316, 145, 433, 148.0, 181.0, 433.0, 433.0, 0.11566816629429634, 0.08980096894918514, 0.04111641848742565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 381.5, 290, 585, 293.0, 581.5, 585.0, 585.0, 0.07987499563183617, 0.12379064264426173, 0.1796407372462097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecc95dae-5be5-4fe2-ba65-7b846d9bff46", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 147.25, 145, 158, 146.0, 155.0, 158.0, 158.0, 0.05558154507431716, 0.0413062068374564, 0.027899330242381854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 194.33333333333331, 141, 443, 146.0, 440.3, 443.0, 443.0, 0.0555823174120873, 0.014872612276281174, 0.031699290399081044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 168.41666666666669, 143, 424, 145.0, 341.5000000000003, 424.0, 424.0, 0.0555823174120873, 0.014981171489976656, 0.03267632332234039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e32300dc-5b77-4483-a0d0-0b3f5f2e7cef", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 145.08333333333334, 143, 147, 145.0, 147.0, 147.0, 147.0, 0.0555823174120873, 0.014981171489976656, 0.03273060292918813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 148.66666666666666, 146, 151, 149.0, 151.0, 151.0, 151.0, 0.09949588750331653, 0.02934351369726718, 0.06150478202109313], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1648.5370370370372, 1123, 2590, 1569.5, 2272.5, 2447.25, 2590.0, 0.24264864476238407, 290.292137453717, 0.47913628877884823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a820c2b6-f894-497b-8309-b05234a55214", 3, 0, 0.0, 397.6666666666667, 264, 599, 330.0, 599.0, 599.0, 599.0, 0.048178839853536326, 0.030974351793858802, 0.03089593571336802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 1310.6923076923076, 224, 2500, 1354.5, 1939.8000000000002, 2329.899999999999, 2500.0, 0.1006343836724583, 0.03153896098869412, 0.0454034035709724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 241.16666666666666, 143, 436, 144.5, 436.0, 436.0, 436.0, 0.03498746282582075, 0.009430214589771998, 0.020602968832001866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 239.66666666666666, 141, 432, 146.0, 432.0, 432.0, 432.0, 0.03498909506537129, 0.009430654529338356, 0.020569760966165546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 323.8947368421053, 141, 1718, 145.0, 1684.0, 1718.0, 1718.0, 0.10738346068634987, 10.196825670722747, 0.06215833338043134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 301.3684210526316, 142, 987, 146.0, 856.0, 987.0, 987.0, 0.10738467451139974, 3.349545240033007, 0.0622639038426758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 177.52631578947367, 143, 441, 147.0, 423.0, 441.0, 441.0, 0.10738103311857126, 0.07980172480784446, 0.05390024513959534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 193.16666666666666, 144, 432, 145.5, 432.0, 432.0, 432.0, 0.03504713840114955, 0.009377847579995094, 0.0199878211194056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 235.42105263157893, 141, 435, 145.0, 434.0, 435.0, 435.0, 0.1073852814342152, 0.045711600577619776, 0.060293832976324374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 193.0, 144, 433, 145.0, 433.0, 433.0, 433.0, 0.03504693368536031, 0.026045621615780463, 0.017591917885034374], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 547.7500000000001, 141, 924, 517.0, 910.7, 924.0, 924.0, 0.08966850673914871, 0.017661149368117243, 0.061017711281419], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 200.83333333333334, 147, 434, 153.5, 434.0, 434.0, 434.0, 0.034582730537127446, 0.027220391418871795, 0.01229307999561952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1545.6956521739125, 1059, 2053, 1482.0, 2001.0, 2047.0, 2053.0, 0.10114958704581636, 0.052352813607697925, 0.04652485888533155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 484.33333333333337, 290, 866, 437.5, 866.0, 866.0, 866.0, 0.0349577011815703, 0.05417760915542194, 0.07862068927847304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2388a164-adbe-400e-8072-e7c08a914537", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1405.389830508475, 734, 3057, 1140.0, 2557.0, 2784.0, 3057.0, 0.26372015268949855, 81.2668037787969, 0.9584125331885107], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 254.59259259259258, 143, 607, 147.0, 586.0, 590.5, 607.0, 0.24405125076266015, 0.18137011897498476, 0.11797399328859061], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 939.1666666666666, 697, 1447, 861.5, 1289.0, 1303.5, 1447.0, 0.24347904502107898, 71.59092350136393, 0.12245284002524968], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 230.33333333333337, 143, 582, 148.5, 436.5, 453.5, 582.0, 0.24458404859069766, 0.432799117232758, 0.11894810175602288], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1389.3333333333333, 975, 2001, 1364.0, 1739.0, 1854.5, 2001.0, 0.24333641259040623, 218.9545317886353, 0.12214347272604376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 157.25, 147, 245, 151.5, 184.80000000000007, 245.0, 245.0, 0.08318256493438975, 0.06214322478008609, 0.029568802379021354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, 5.813953488372093, 215.69767441860466, 143, 662, 151.0, 393.00000000000017, 518.0499999999998, 645.2100000000003, 0.751170428341835, 1.6262834655706275, 0.36177116406304594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 176.91666666666666, 146, 429, 152.5, 350.4000000000003, 429.0, 429.0, 0.05653044399952891, 0.04377797079260393, 0.02009480626545754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a328f10c-52aa-4c5d-92b2-1f8c14b0e524", 3, 0, 0.0, 511.33333333333337, 258, 924, 352.0, 924.0, 924.0, 924.0, 0.049028420140874995, 0.03183974550164245, 0.031440751197110595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.7058823529412, 144, 164, 150.0, 159.2, 164.0, 164.0, 0.09518583634755148, 0.07724553711407742, 0.03383559026416869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9b0bf58-3728-40df-849c-485ba3d4a14d", 3, 0, 0.0, 570.0, 395, 905, 410.0, 905.0, 905.0, 905.0, 0.023382696804364767, 0.023451200798908806, 0.014994763250194854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14f71f5b-beb8-4a6a-a7ec-45a9a062f0b9", 3, 0, 0.0, 359.3333333333333, 261, 473, 344.0, 473.0, 473.0, 473.0, 0.01985939548000159, 0.027377779901629793, 0.012735354523308309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05257362-2ca3-4572-a826-4fa9b7f3043d", 3, 0, 0.0, 530.6666666666666, 461, 660, 471.0, 660.0, 660.0, 660.0, 0.03220335344253848, 0.026846610731230812, 0.0206512390240237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 343.1666666666667, 290, 591, 294.0, 587.7, 591.0, 591.0, 0.0555442409879469, 0.08608272504674973, 0.12492029980004073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 592.7894736842105, 288, 2160, 299.0, 1832.0, 2160.0, 2160.0, 0.10729310782957337, 13.660343858528389, 0.23841503550554818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d475431-a3d1-47e0-bbd5-abf8f2ceab72", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 180.5, 145, 482, 148.0, 389.3000000000003, 482.0, 482.0, 0.08604185936458086, 0.07133744003957924, 0.030585192196003353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 154.21428571428572, 144, 174, 149.0, 171.5, 174.0, 174.0, 0.0749063670411985, 0.058154845505617975, 0.02662687265917603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc95dae-5be5-4fe2-ba65-7b846d9bff46", 3, 0, 0.0, 417.66666666666663, 260, 719, 274.0, 719.0, 719.0, 719.0, 0.031845443447800006, 0.03214606775118094, 0.020421719919324878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eb8b1c3-0038-42e6-ad2a-8816010b2063", 3, 0, 0.0, 387.6666666666667, 259, 539, 365.0, 539.0, 539.0, 539.0, 0.020121264151955788, 0.023782653038981597, 0.012903284628695605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a820c2b6-f894-497b-8309-b05234a55214", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f07c21a-0a2f-4f27-98d5-60e213ab9155", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ab40e0-f4b5-4979-8948-ecd2367007be", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e7fd851-c9bd-45d2-8b4d-d539b1ae30cb", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2451db5-c1f0-4c26-b699-bdebd4df7a59", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62172bbc-f2fc-4696-996d-efefbb375c89", 3, 0, 0.0, 399.0, 257, 476, 464.0, 476.0, 476.0, 476.0, 0.053002597127259236, 0.034075562931750326, 0.03398929568382184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad3e248d-108b-4439-8a6f-554f737b3937", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 145.31250000000003, 142, 149, 145.0, 148.3, 149.0, 149.0, 0.07993325573146423, 0.059403523058246366, 0.040122747505832626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 197.75000000000003, 141, 438, 144.0, 435.2, 438.0, 438.0, 0.07993325573146423, 0.0213883906937707, 0.045586934909350695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 216.12499999999997, 143, 439, 145.0, 432.0, 439.0, 439.0, 0.07993365506629498, 0.02154461796708732, 0.04699224643545857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 197.625, 141, 428, 145.0, 426.6, 428.0, 428.0, 0.07993365506629498, 0.02154461796708732, 0.04707030664548425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6139677666922486], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.23023791250959325], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.2279355333844972], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
