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

    var data = {"OkPercent": 98.31501831501832, "KoPercent": 1.684981684981685};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8137562814070352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9046f9cf-d17d-428c-a122-899cfa33e4cd"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7934aa9d-51ba-457a-a303-194f0fd69569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/935a6b14-2abd-41e2-9415-4a93713c6e13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e3c93d9-9fba-4327-a478-b4ed9ce0e234"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b7f2be2-0f38-4d21-8a74-cede257b66f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/550e8cb8-7380-4081-ae62-b7c6a2c37eab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1789c039-b578-4004-93a5-9b3406ca3ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd0b0901-d975-404f-bdbc-e53ba139c5df"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=364f6227-88ef-4e17-8517-55716c0df8bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec4c32f-de6c-414c-84f0-be655044cad8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a30943d2-fbe7-4b1e-bb7c-d6bd7aec12c6"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96c88b8d-57c8-448f-9a12-ddfe518b3d85"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cec4c32f-de6c-414c-84f0-be655044cad8"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9046f9cf-d17d-428c-a122-899cfa33e4cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71db3c56-e029-47eb-9c2f-1fd019e53ff5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b7f2be2-0f38-4d21-8a74-cede257b66f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5835667-d2bf-4271-a322-d13b8a4327e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd0b0901-d975-404f-bdbc-e53ba139c5df"], "isController": false}, {"data": [0.4435483870967742, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=935a6b14-2abd-41e2-9415-4a93713c6e13"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5341d138-f346-408c-9d1c-93e18c75ba8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e3c93d9-9fba-4327-a478-b4ed9ce0e234"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7934aa9d-51ba-457a-a303-194f0fd69569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97727848-f317-47e8-a294-e413ae6b824a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6251531-d992-4557-af65-d979f0158cd5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a30943d2-fbe7-4b1e-bb7c-d6bd7aec12c6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/364f6227-88ef-4e17-8517-55716c0df8bf"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5341d138-f346-408c-9d1c-93e18c75ba8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1789c039-b578-4004-93a5-9b3406ca3ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96c88b8d-57c8-448f-9a12-ddfe518b3d85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f3cc51d-e809-4577-bd5a-03756a97b57a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1365, 23, 1.684981684981685, 299.5890109890117, 77, 2905, 92.0, 854.2000000000003, 1018.4000000000001, 1477.7999999999984, 5.320081847413038, 749.487018750609, 3.8805052129007116], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1330.086206896552, 958, 1819, 1346.5, 1612.0, 1738.1999999999998, 1819.0, 0.24969541464506656, 300.4667679753792, 1.2277504030643656], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 545.2666666666667, 80, 1230, 477.0, 1105.8000000000002, 1230.0, 1230.0, 0.09118042173984402, 0.018556640518147944, 0.06110156777136814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 545.2666666666667, 80, 1230, 477.0, 1105.8000000000002, 1230.0, 1230.0, 0.09017891496729512, 0.018352818241390918, 0.06043044086968545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.10526315789474, 78, 238, 80.0, 236.0, 238.0, 238.0, 0.1151598904162727, 0.05812449238732514, 0.06415002530487066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 88.6842105263158, 78, 239, 81.0, 82.0, 239.0, 239.0, 0.11526818052210419, 0.08566316931379032, 0.05785922342613433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 198.10526315789477, 77, 621, 80.0, 620.0, 621.0, 621.0, 0.11516128641218042, 5.372650463524178, 0.06625207025141527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 206.47368421052633, 78, 856, 80.0, 845.0, 856.0, 856.0, 0.1152688798291594, 16.402869427280503, 0.06620140127523783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9046f9cf-d17d-428c-a122-899cfa33e4cd", 3, 0, 0.0, 311.6666666666667, 203, 487, 245.0, 487.0, 487.0, 487.0, 0.024253791676098698, 0.02866716066924296, 0.015553375521456522], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 235.8, 79, 418, 203.0, 413.2, 418.0, 418.0, 0.09106528166491619, 0.17866818543319754, 0.05885449551351712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7934aa9d-51ba-457a-a303-194f0fd69569", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.14285714285714, 79, 89, 80.5, 86.5, 89.0, 89.0, 0.09124028128075287, 0.067806498100247, 0.0457983443147529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 527.6, 466, 620, 468.0, 620.0, 620.0, 620.0, 0.02833888775533338, 8.332573939700515, 0.016162021922963565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 102.21428571428572, 78, 237, 80.0, 236.5, 237.0, 237.0, 0.09124087591240876, 0.0244140625, 0.05203581204379562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/935a6b14-2abd-41e2-9415-4a93713c6e13", 3, 0, 0.0, 783.6666666666666, 343, 1138, 870.0, 1138.0, 1138.0, 1138.0, 0.016980042789707828, 0.023408359770316623, 0.010888894627514462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 874.2, 696, 1009, 888.0, 1009.0, 1009.0, 1009.0, 0.02825209913096543, 25.421288459935695, 0.016084935345071136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 175.4, 79, 239, 238.0, 239.0, 239.0, 239.0, 0.028375556160900754, 0.050211433362843914, 0.015711855803936258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 91.5625, 78, 239, 81.0, 136.1000000000001, 239.0, 239.0, 0.07654403674113763, 0.05688477730469311, 0.03842151844232885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 118.75, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.07648805113226217, 0.027646621020828654, 0.04322060408828633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 166.81249999999997, 77, 691, 80.0, 374.6000000000003, 691.0, 691.0, 0.07654586771917235, 4.324098679882789, 0.04458946298289678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 167.375, 78, 543, 82.5, 330.2000000000002, 543.0, 543.0, 0.07648841678538307, 1.424960904260405, 0.044630692411392954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.6, 80, 82, 80.0, 82.0, 82.0, 82.0, 0.028400538474209473, 0.021106259549681063, 0.015947567990889106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 496.29411764705884, 78, 1101, 692.0, 974.5999999999999, 1101.0, 1101.0, 0.07983169600090163, 38.039202388904805, 0.04330025698762139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 80.0, 78, 85, 80.0, 83.0, 85.0, 85.0, 0.09124147055181539, 0.02459242760966899, 0.05364000514862584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 393.88235294117635, 78, 708, 428.0, 704.8, 708.0, 708.0, 0.07983132111444524, 12.437039282292943, 0.04337801392586957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 90.92857142857143, 77, 234, 80.0, 159.5, 234.0, 234.0, 0.09124087591240876, 0.024592267335766423, 0.053728757983576646], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 460.1333333333334, 81, 932, 437.0, 915.8, 932.0, 932.0, 0.09035001596183616, 0.018387639967233062, 0.06100390726173195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4e3c93d9-9fba-4327-a478-b4ed9ce0e234", 3, 0, 0.0, 1145.0, 389, 2648, 398.0, 2648.0, 2648.0, 2648.0, 0.03071032993131123, 0.03080030160103187, 0.01969379881662862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 289.0, 159, 770, 316.0, 564.2000000000003, 770.0, 770.0, 0.07645734874586055, 5.827936208587594, 0.17073172370703454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b7f2be2-0f38-4d21-8a74-cede257b66f5", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/550e8cb8-7380-4081-ae62-b7c6a2c37eab", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1789c039-b578-4004-93a5-9b3406ca3ed9", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd0b0901-d975-404f-bdbc-e53ba139c5df", 3, 0, 0.0, 323.0, 201, 448, 320.0, 448.0, 448.0, 448.0, 0.035891177948460265, 0.029383565280070825, 0.023016152525542555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 567.304347826087, 115, 1302, 535.0, 1186.4000000000003, 1300.0, 1302.0, 0.10437655430303691, 0.0641141139224709, 0.04719369593975204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 89.29411764705883, 78, 236, 80.0, 114.39999999999989, 236.0, 236.0, 0.07983169600090163, 0.05932804751629506, 0.04007176928170257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 141.1176470588235, 78, 326, 80.0, 260.3999999999999, 326.0, 326.0, 0.07983169600090163, 0.08483952068110524, 0.04197951201701824], "isController": false}, {"data": ["login", 23, 0, 0.0, 2580.9565217391305, 1463, 4249, 2640.0, 3648.2000000000003, 4138.199999999999, 4249.0, 0.10146820074821769, 26.529604691746226, 0.1896712609519482], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 83.78571428571429, 80, 100, 82.0, 93.0, 100.0, 100.0, 0.08604582554823482, 0.06966014587840495, 0.030586602050349097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 602.7058823529412, 159, 1181, 783.0, 1055.3999999999999, 1181.0, 1181.0, 0.07980134160137821, 50.60122022705829, 0.16866559981270157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=364f6227-88ef-4e17-8517-55716c0df8bf", 1, 0, 0.0, 905.0, 905, 905, 905.0, 905.0, 905.0, 905.0, 1.1049723756906078, 0.19962879834254144, 0.7618266574585635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec4c32f-de6c-414c-84f0-be655044cad8", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a30943d2-fbe7-4b1e-bb7c-d6bd7aec12c6", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 478.9999999999999, 79, 1089, 91.0, 1074.4, 1089.0, 1089.0, 0.05571256368958986, 30.304310886234944, 0.07723787238784048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 337.6842105263158, 159, 938, 174.0, 926.0, 938.0, 938.0, 0.11510338101036537, 21.892904444505028, 0.25422015755532534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96c88b8d-57c8-448f-9a12-ddfe518b3d85", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 977.5833333333335, 250, 1914, 953.0, 1469.0, 1803.25, 1914.0, 0.09790523589042772, 0.03102563383441777, 0.044172088849001576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.5, 81, 246, 88.0, 242.5, 246.0, 246.0, 0.08369301402455792, 0.0649765099116441, 0.029750251079042077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 196.21428571428572, 160, 319, 163.0, 317.5, 319.0, 319.0, 0.09119095385737734, 0.14132816774575963, 0.20509059251322267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec4c32f-de6c-414c-84f0-be655044cad8", 3, 0, 0.0, 299.3333333333333, 214, 463, 221.0, 463.0, 463.0, 463.0, 0.024239681975372483, 0.028792512867231182, 0.015544327308425714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 321.9047619047619, 159, 1019, 215.0, 904.0000000000003, 1017.6999999999999, 1019.0, 0.10580571048534591, 12.203638716639711, 0.23538129575467182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 92.5, 79, 244, 81.0, 164.0, 244.0, 244.0, 0.06810497896042615, 0.05061317284070732, 0.034185507017245154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 80.0, 78, 85, 80.0, 83.5, 85.0, 85.0, 0.06810762951395476, 0.02553085944531201, 0.03843406269307297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 158.92857142857142, 78, 1022, 80.5, 629.0, 1022.0, 1022.0, 0.06810696685623105, 4.394386351667891, 0.03962137999309201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 118.64285714285714, 78, 460, 80.5, 348.5, 460.0, 460.0, 0.06810663553220471, 1.4474465332506323, 0.03968769763086204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 83.0, 81, 86, 82.0, 86.0, 86.0, 86.0, 0.018879323365050597, 0.0055679254455520315, 0.011670519228590848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9046f9cf-d17d-428c-a122-899cfa33e4cd", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 927.0172413793106, 623, 1491, 861.0, 1270.9, 1394.1, 1491.0, 0.25740368442308287, 307.94429456966986, 0.5082717284213609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 977.5833333333335, 250, 1914, 953.0, 1469.0, 1803.25, 1914.0, 0.09389157088422387, 0.029753725343682272, 0.04236123608253069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 141.6, 77, 237, 81.0, 237.0, 237.0, 237.0, 0.02322923538648802, 0.006261004850264348, 0.013678934509816673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 110.8, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.023246299189169085, 0.00626560407833073, 0.013666281359257607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 146.07142857142856, 79, 853, 79.0, 546.5, 853.0, 853.0, 0.08236505368436535, 5.314344250992793, 0.0479160538314458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71db3c56-e029-47eb-9c2f-1fd019e53ff5", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 118.14285714285715, 78, 462, 79.5, 350.5, 462.0, 462.0, 0.08236456911563986, 1.7504654149703487, 0.047996206082035114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 79.0, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.02324640726775677, 0.006220230069692729, 0.013257716644892533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 81.57142857142858, 79, 87, 81.0, 85.5, 87.0, 87.0, 0.08236214635753408, 0.061208587283284606, 0.041341936745871596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 114.8, 79, 252, 81.0, 252.0, 252.0, 252.0, 0.0232460830350086, 0.01727565350550932, 0.011668444023432051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 79.78571428571429, 78, 83, 79.0, 82.0, 83.0, 83.0, 0.08236359999529351, 0.030874859540646435, 0.04647890094600478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 88.0, 81, 105, 82.0, 105.0, 105.0, 105.0, 0.024188710644967783, 0.019039160917816437, 0.008598330737078391], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 561.1333333333333, 79, 1494, 463.0, 1204.2000000000003, 1494.0, 1494.0, 0.09019843656043296, 0.017863518490679492, 0.0613772173782321], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1463.1304347826083, 756, 2905, 1343.0, 2419.2000000000007, 2838.7999999999993, 2905.0, 0.1025888062231262, 0.053097721970953984, 0.04718684348739496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 258.2, 160, 487, 163.0, 487.0, 487.0, 487.0, 0.02322038935948878, 0.035987068274910834, 0.05222319989736588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b7f2be2-0f38-4d21-8a74-cede257b66f5", 3, 0, 0.0, 488.33333333333337, 253, 875, 337.0, 875.0, 875.0, 875.0, 0.05481254110940584, 0.03523918251662647, 0.035149969396331214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5835667-d2bf-4271-a322-d13b8a4327e4", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd0b0901-d975-404f-bdbc-e53ba139c5df", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["addBook", 62, 6, 9.67741935483871, 858.5806451612905, 408, 1655, 728.0, 1394.8, 1511.0999999999997, 1655.0, 0.29309293409663556, 97.28433940486771, 1.0646731939920675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=935a6b14-2abd-41e2-9415-4a93713c6e13", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5341d138-f346-408c-9d1c-93e18c75ba8a", 3, 0, 0.0, 547.0, 220, 1011, 410.0, 1011.0, 1011.0, 1011.0, 0.05052376300986897, 0.03281084218902624, 0.03239967875307353], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 153.27586206896552, 78, 409, 82.0, 322.2, 337.15, 409.0, 0.25821042368769004, 0.19189270744758996, 0.12481851535684235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e3c93d9-9fba-4327-a478-b4ed9ce0e234", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 509.9655172413792, 387, 801, 472.0, 640.2, 708.0, 801.0, 0.25811734548561666, 75.89506987525812, 0.1298148759034107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7934aa9d-51ba-457a-a303-194f0fd69569", 3, 0, 0.0, 258.0, 175, 384, 215.0, 384.0, 384.0, 384.0, 0.04569339730408956, 0.02937645171731018, 0.02930208095346889], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 105.5, 77, 255, 81.0, 236.1, 239.49999999999997, 255.0, 0.2585534380920539, 0.45751838849882986, 0.1257418087596122], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 772.0172413793103, 540, 1169, 775.5, 961.1, 1033.3, 1169.0, 0.25784195177466396, 232.00664144464847, 0.12942457344939184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 94.9047619047619, 79, 243, 85.0, 110.80000000000001, 229.99999999999983, 243.0, 0.1031327809999951, 0.07704743893066039, 0.036660480746092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, 3.2967032967032965, 143.26373626373626, 79, 769, 88.5, 265.80000000000024, 378.8499999999999, 626.2399999999978, 0.7457763244700685, 1.6075319759282252, 0.3593106217295455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 102.42857142857143, 80, 275, 84.0, 209.5, 275.0, 275.0, 0.06810696685623105, 0.052742992887686746, 0.024209898374675885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 87.47368421052632, 81, 130, 83.0, 100.0, 130.0, 130.0, 0.11236353744071345, 0.09118564415354774, 0.03994172619962861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97727848-f317-47e8-a294-e413ae6b824a", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6251531-d992-4557-af65-d979f0158cd5", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a30943d2-fbe7-4b1e-bb7c-d6bd7aec12c6", 3, 0, 0.0, 386.66666666666663, 164, 755, 241.0, 755.0, 755.0, 755.0, 0.022709380488100284, 0.02684171892978259, 0.014562981628111184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/364f6227-88ef-4e17-8517-55716c0df8bf", 3, 0, 0.0, 733.3333333333333, 200, 1494, 506.0, 1494.0, 1494.0, 1494.0, 0.020142880163291618, 0.02776858642302734, 0.012917146458881666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 252.78571428571428, 159, 1102, 163.0, 792.0, 1102.0, 1102.0, 0.0680781537204711, 5.915481542006653, 0.15186518945177635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 240.85714285714283, 160, 933, 164.5, 627.5, 933.0, 933.0, 0.08232243345113281, 7.153202737735428, 0.18364058466568273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5341d138-f346-408c-9d1c-93e18c75ba8a", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1789c039-b578-4004-93a5-9b3406ca3ed9", 3, 0, 0.0, 335.3333333333333, 168, 420, 418.0, 420.0, 420.0, 420.0, 0.049609736737663716, 0.03189428061747586, 0.031813535603254395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 96.37500000000001, 81, 237, 83.5, 165.60000000000008, 237.0, 237.0, 0.07494390916798209, 0.062136112191032024, 0.026640217712056134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 94.70588235294116, 80, 250, 83.0, 125.99999999999989, 250.0, 250.0, 0.078754018771252, 0.06114203605775913, 0.027994592610093485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96c88b8d-57c8-448f-9a12-ddfe518b3d85", 3, 0, 0.0, 317.3333333333333, 196, 559, 197.0, 559.0, 559.0, 559.0, 0.034781802161109314, 0.028996157335482078, 0.02230473641190929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 97.23809523809523, 78, 259, 81.0, 209.0000000000001, 256.9, 259.0, 0.10584890824411781, 0.07866310466188835, 0.05313119027097321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 104.23809523809524, 77, 236, 80.0, 235.6, 236.0, 236.0, 0.10584997530167242, 0.04346425232113874, 0.05952092175166587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 199.1904761904762, 77, 939, 81.0, 787.0000000000005, 937.5, 939.0, 0.1058494417702059, 9.096623450061745, 0.0613615672017944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 185.8571428571429, 78, 624, 83.0, 547.2000000000003, 623.9, 624.0, 0.1058494417702059, 2.98993170190781, 0.061464935797273114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f3cc51d-e809-4577-bd5a-03756a97b57a", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.3663003663003663], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.21978021978021978], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 13.043478260869565, 0.21978021978021978], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.8791208791208791], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1365, 23, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
