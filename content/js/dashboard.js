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

    var data = {"OkPercent": 99.07192575406033, "KoPercent": 0.9280742459396751};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8099667774086379, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25925925925925924, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6b804da-28b0-4708-8d9a-2c88b18cabb1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac5b963c-1e99-4e5f-a075-9e1fd763d5ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=659f4d6e-2a45-4f6e-9e97-b348975bb1ba"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7c58ccb-bec5-4f2a-8684-15203f9f3f40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d461732b-94dc-403d-8b7f-c136c8474947"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23f7d56e-cb73-46ef-83ee-4d14fcd3293e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cba255c6-bac0-426e-bfb7-32d1f9bdb09e"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a90424a-0f62-417b-b149-4b09a16f2bf5"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cbcbc4b-4fe4-4401-8b34-30f0e122516e"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3b63be9-0283-4836-9eed-8095c1eef019"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c6c31ca-3bfc-48e2-a71e-c7b8aa1e26e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bc48740-26a5-4f18-a8d7-25644c8b5441"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5639840-f3f4-4b5a-8e54-3ef30d6efc6c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e744038-d8f1-4c8a-be44-58207f41fa1c"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d85c14a7-d0d7-463c-85e6-fe5d9e520914"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6b804da-28b0-4708-8d9a-2c88b18cabb1"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa496819-e319-4ee1-b175-8ca4f3092e8b"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7c58ccb-bec5-4f2a-8684-15203f9f3f40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3b63be9-0283-4836-9eed-8095c1eef019"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d461732b-94dc-403d-8b7f-c136c8474947"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac5b963c-1e99-4e5f-a075-9e1fd763d5ef"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9659090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44382e20-e8a2-4ff6-ac7d-9b877695dcd0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cbcbc4b-4fe4-4401-8b34-30f0e122516e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c6c31ca-3bfc-48e2-a71e-c7b8aa1e26e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6162db9-e712-4895-aeb1-1a230aaa3a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/659f4d6e-2a45-4f6e-9e97-b348975bb1ba"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a90424a-0f62-417b-b149-4b09a16f2bf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5639840-f3f4-4b5a-8e54-3ef30d6efc6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bc48740-26a5-4f18-a8d7-25644c8b5441"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e744038-d8f1-4c8a-be44-58207f41fa1c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 12, 0.9280742459396751, 324.73317865429215, 97, 3165, 124.0, 804.6000000000001, 982.5999999999999, 1307.3599999999997, 5.007648961096803, 698.2307314561104, 3.649254891946322], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1466.4444444444446, 1189, 1922, 1469.5, 1734.0, 1764.5, 1922.0, 0.24712488501828267, 297.37595346157894, 1.2151111289717316], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6b804da-28b0-4708-8d9a-2c88b18cabb1", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 549.0, 103, 1019, 463.0, 977.8, 1019.0, 1019.0, 0.08271772259021004, 0.015671131037598388, 0.05591772728285007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 549.0, 103, 1019, 463.0, 977.8, 1019.0, 1019.0, 0.08169318553150842, 0.015477029290149057, 0.05522513345838675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 153.4, 99, 307, 102.0, 302.8, 307.0, 307.0, 0.10565314775944891, 0.03884954287404736, 0.05966376325947005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 128.93333333333334, 100, 302, 102.0, 300.8, 302.0, 302.0, 0.10580368478966228, 0.07862949621575488, 0.05310849021668595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 166.5333333333333, 98, 486, 102.0, 375.6000000000001, 486.0, 486.0, 0.10552010861536514, 2.094972604341801, 0.06153278729608239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 220.33333333333331, 98, 903, 102.0, 543.6000000000003, 903.0, 903.0, 0.1052114750648804, 6.337765275391036, 0.06125006575717192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac5b963c-1e99-4e5f-a075-9e1fd763d5ef", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=659f4d6e-2a45-4f6e-9e97-b348975bb1ba", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 362.8461538461538, 105, 1911, 206.0, 1332.1999999999994, 1911.0, 1911.0, 0.08306019308300269, 0.19173976362985823, 0.0536908775149668], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7c58ccb-bec5-4f2a-8684-15203f9f3f40", 3, 0, 0.0, 740.6666666666667, 290, 1545, 387.0, 1545.0, 1545.0, 1545.0, 0.06378228978420326, 0.028236951206548316, 0.04090205432125014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 128.43478260869566, 99, 301, 102.0, 299.4, 301.0, 301.0, 0.1178773870170871, 0.0876022378125032, 0.0591689227800613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 126.39130434782608, 98, 302, 101.0, 297.2, 301.2, 302.0, 0.11787980360199678, 0.03154205682319054, 0.06722832549176379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 622.0, 492, 805, 595.5, 805.0, 805.0, 805.0, 0.019139854919899706, 5.627752849445901, 0.010915698509005301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 823.5, 683, 992, 809.5, 992.0, 992.0, 992.0, 0.019102014307408717, 17.18802605156589, 0.010875463223846955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 298.25, 297, 300, 298.0, 300.0, 300.0, 300.0, 0.019157913894756, 0.03390052732157996, 0.010607946463209622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d461732b-94dc-403d-8b7f-c136c8474947", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 113.0, 100, 298, 102.0, 111.0, 298.0, 298.0, 0.11604045536717643, 0.08623709622502077, 0.05824686919797724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 122.52631578947368, 98, 300, 101.0, 298.0, 300.0, 300.0, 0.11604329025480664, 0.04022388720592187, 0.0656680009100237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 205.57894736842104, 99, 888, 104.0, 300.0, 888.0, 888.0, 0.11603974666691096, 5.525039058444334, 0.06769382836499997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 164.1578947368421, 99, 706, 102.0, 298.0, 706.0, 706.0, 0.11604258151991352, 1.8254399884262793, 0.06780880495990423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 151.25, 100, 300, 102.5, 300.0, 300.0, 300.0, 0.019175547342029444, 0.014250577663363679, 0.010767519259440363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 117.86956521739128, 98, 297, 101.0, 218.60000000000028, 296.6, 297.0, 0.11788040776370616, 0.03177245365506143, 0.06930078659546007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 458.55555555555554, 98, 981, 395.0, 916.2, 981.0, 981.0, 0.09552162768853581, 42.98813728348431, 0.052051824463088855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 140.26086956521738, 99, 400, 101.0, 302.0, 380.7999999999997, 400.0, 0.1178810119316085, 0.03177261649719136, 0.06941625995582025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 401.2777777777778, 99, 794, 395.0, 793.1, 794.0, 794.0, 0.09552061387914519, 14.055988926905503, 0.052144553865666174], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 476.07692307692315, 102, 774, 422.0, 745.6, 774.0, 774.0, 0.08163777945239889, 0.015466532435317759, 0.05583773902599849], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23f7d56e-cb73-46ef-83ee-4d14fcd3293e", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cba255c6-bac0-426e-bfb7-32d1f9bdb09e", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 330.15789473684214, 203, 989, 212.0, 599.0, 989.0, 989.0, 0.11596750468447684, 7.472238848045947, 0.25925198479910155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a90424a-0f62-417b-b149-4b09a16f2bf5", 3, 0, 0.0, 263.3333333333333, 193, 391, 206.0, 391.0, 391.0, 391.0, 0.04417286313774572, 0.03682509846867407, 0.02832699882205698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 608.1363636363636, 145, 1172, 606.0, 1055.6, 1154.8999999999996, 1172.0, 0.09632139823644277, 0.05916617137765869, 0.04355156971042285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 112.27777777777777, 100, 299, 101.0, 122.60000000000028, 299.0, 299.0, 0.0955190932054085, 0.07098635735284753, 0.047946107331621066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 189.33333333333334, 99, 309, 102.5, 301.8, 309.0, 309.0, 0.09552061387914519, 0.0972929690194809, 0.05046548057482183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cbcbc4b-4fe4-4401-8b34-30f0e122516e", 3, 0, 0.0, 277.0, 211, 407, 213.0, 407.0, 407.0, 407.0, 0.021016939653360607, 0.0289735479921817, 0.013477659868854297], "isController": false}, {"data": ["login", 22, 0, 0.0, 2262.045454545454, 1375, 5243, 2072.5, 3122.2999999999997, 4945.999999999995, 5243.0, 0.0947748881010128, 20.747252874479276, 0.17156913558840128], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f3b63be9-0283-4836-9eed-8095c1eef019", 3, 0, 0.0, 319.6666666666667, 199, 556, 204.0, 556.0, 556.0, 556.0, 0.01798701337634228, 0.024796550015888527, 0.011534640739386162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c6c31ca-3bfc-48e2-a71e-c7b8aa1e26e3", 3, 0, 0.0, 451.33333333333337, 213, 764, 377.0, 764.0, 764.0, 764.0, 0.021760259962572352, 0.025719890600293036, 0.013954333374436046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 129.3478260869565, 102, 420, 106.0, 230.00000000000026, 396.39999999999964, 420.0, 0.12030358347761046, 0.09739420967083894, 0.04276416443930684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bc48740-26a5-4f18-a8d7-25644c8b5441", 3, 0, 0.0, 494.33333333333337, 210, 912, 361.0, 912.0, 912.0, 912.0, 0.04757675716823141, 0.03089701515319716, 0.030509834512179652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 599.3888888888888, 201, 1084, 694.0, 1019.2, 1084.0, 1084.0, 0.0954684317718941, 57.180696009618444, 0.20249749395366598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5639840-f3f4-4b5a-8e54-3ef30d6efc6c", 3, 0, 0.0, 352.33333333333337, 183, 680, 194.0, 680.0, 680.0, 680.0, 0.017512112544509954, 0.02414186088085926, 0.01123009821376452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 704.6666666666666, 100, 1209, 861.0, 1209.0, 1209.0, 1209.0, 0.028638524543215534, 22.843642158056017, 0.04937628425883498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e744038-d8f1-4c8a-be44-58207f41fa1c", 3, 0, 0.0, 325.3333333333333, 185, 544, 247.0, 544.0, 544.0, 544.0, 0.03081094404732561, 0.03090121048496426, 0.019758320238682115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 390.5333333333333, 203, 1003, 401.0, 761.8000000000002, 1003.0, 1003.0, 0.10513404590853338, 8.53719938233748, 0.23465563124233396], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 945.6086956521737, 204, 1558, 929.0, 1352.4000000000003, 1529.1999999999996, 1558.0, 0.09256017417410166, 0.02944381899254287, 0.04176054733245602], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 287.6521739130434, 200, 602, 208.0, 601.0, 601.8, 602.0, 0.11781579756172524, 0.18259147532271283, 0.2649704900240754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 109.35294117647061, 102, 125, 107.0, 125.0, 125.0, 125.0, 0.08362396761292924, 0.06492290454324097, 0.029725707237408444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d85c14a7-d0d7-463c-85e6-fe5d9e520914", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 457.6, 203, 984, 403.0, 880.8000000000001, 984.0, 984.0, 0.0733977276063533, 17.652841593024277, 0.161317310303573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 135.33333333333334, 101, 302, 102.0, 302.0, 302.0, 302.0, 0.07657260997741108, 0.05690601190704085, 0.03843586086756767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 267.0, 103, 310, 294.5, 310.0, 310.0, 310.0, 0.07656479295603906, 0.03965318541440695, 0.04259415076883813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 262.33333333333337, 100, 875, 102.0, 875.0, 875.0, 875.0, 0.07601672367920942, 11.417071000411756, 0.04360073799569238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 2.891390931372549, 6.060431985294118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 232.16666666666666, 99, 502, 198.5, 502.0, 502.0, 502.0, 0.07637766207976374, 3.7600832436956604, 0.04388234816757259], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 935.9629629629628, 782, 1484, 804.5, 1303.0, 1340.5, 1484.0, 0.2334731289722859, 279.31503064334817, 0.46101822927925984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6b804da-28b0-4708-8d9a-2c88b18cabb1", 3, 0, 0.0, 938.6666666666666, 236, 1911, 669.0, 1911.0, 1911.0, 1911.0, 0.07117606586158629, 0.03303941078080144, 0.04564350577712401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 945.6086956521737, 204, 1558, 929.0, 1352.4000000000003, 1529.1999999999996, 1558.0, 0.08934155275618691, 0.02841996065087263, 0.04030839587242026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 103.5, 101, 106, 103.5, 106.0, 106.0, 106.0, 0.03539447138356989, 0.00953991611510282, 0.02084264281669203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 103.5, 101, 106, 103.5, 106.0, 106.0, 106.0, 0.03539447138356989, 0.00953991611510282, 0.020808077903231515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa496819-e319-4ee1-b175-8ca4f3092e8b", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 205.94117647058823, 97, 887, 101.0, 731.7999999999998, 887.0, 887.0, 0.08424766832188557, 8.938412399150586, 0.048676645679085764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 182.88235294117644, 98, 707, 100.0, 690.1999999999999, 707.0, 707.0, 0.08433334490849832, 2.937327302672375, 0.048808504707784965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 101.41176470588235, 99, 104, 101.0, 104.0, 104.0, 104.0, 0.08433292655098173, 0.0626732002981417, 0.04233117602266075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 102.5, 100, 105, 102.5, 105.0, 105.0, 105.0, 0.035395097778957614, 0.009470953897885142, 0.020186266702061764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 147.70588235294116, 99, 304, 102.0, 300.8, 304.0, 304.0, 0.08433250819761587, 0.03746711962318251, 0.047262634994022314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 104.5, 101, 108, 104.5, 108.0, 108.0, 108.0, 0.03539321865930488, 0.026302968163799813, 0.017765736709846394], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 622.2307692307693, 100, 1545, 556.0, 1291.7999999999997, 1545.0, 1545.0, 0.08252448755467247, 0.015460942905750688, 0.05616525369931886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7c58ccb-bec5-4f2a-8684-15203f9f3f40", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 106.0, 101, 111, 106.0, 111.0, 111.0, 111.0, 0.034798949071738035, 0.027390579054512556, 0.01236993892784438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1202.8181818181818, 786, 3165, 1023.0, 1806.8, 2968.649999999997, 3165.0, 0.09722038092712891, 0.05031914247204914, 0.04471757755534933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 209.0, 208, 210, 209.0, 210.0, 210.0, 210.0, 0.035326326945155875, 0.054748907091760134, 0.07944973726044334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3b63be9-0283-4836-9eed-8095c1eef019", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d461732b-94dc-403d-8b7f-c136c8474947", 3, 0, 0.0, 608.6666666666666, 206, 964, 656.0, 964.0, 964.0, 964.0, 0.02041316240712011, 0.024127666894613646, 0.01309047198633679], "isController": false}, {"data": ["addBook", 61, 4, 6.557377049180328, 1005.7213114754097, 525, 2083, 868.0, 1580.6, 1624.0, 2083.0, 0.282326369282891, 95.19245705515083, 1.0259461115328008], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac5b963c-1e99-4e5f-a075-9e1fd763d5ef", 3, 0, 0.0, 446.6666666666667, 372, 504, 464.0, 504.0, 504.0, 504.0, 0.01665315910428208, 0.02295772422090971, 0.010679271951639226], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 186.14814814814815, 100, 538, 103.5, 405.5, 420.25, 538.0, 0.23419305314013852, 0.17404386078090373, 0.11320855596129742], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 587.3888888888891, 490, 812, 504.0, 780.5, 795.0, 812.0, 0.23413415887303424, 68.8432166944159, 0.11775301935509047], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 145.3333333333334, 100, 332, 104.0, 304.5, 307.25, 332.0, 0.23453889219463253, 0.41502389907878334, 0.11406285968059278], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 743.6481481481482, 681, 1044, 693.0, 901.0, 913.0, 1044.0, 0.23391812865497078, 210.47994334795322, 0.11741593567251463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 107.06666666666668, 101, 116, 106.0, 115.4, 116.0, 116.0, 0.07783878031820493, 0.05815104193694021, 0.027669253941236913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, 2.272727272727273, 175.7727272727274, 100, 1076, 109.0, 303.20000000000005, 367.35, 1019.0199999999993, 0.7444032296949216, 1.5407218768372166, 0.36116096636016426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 108.16666666666667, 99, 128, 106.0, 128.0, 128.0, 128.0, 0.09008062215683035, 0.06975970055699851, 0.032020846157310795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 109.33333333333333, 101, 133, 107.0, 126.4, 133.0, 133.0, 0.11173683740055422, 0.09067706238267632, 0.03971895391972825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44382e20-e8a2-4ff6-ac7d-9b877695dcd0", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cbcbc4b-4fe4-4401-8b34-30f0e122516e", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 497.16666666666663, 207, 977, 403.0, 977.0, 977.0, 977.0, 0.07572697899838449, 15.197100662453302, 0.16708250769890953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c6c31ca-3bfc-48e2-a71e-c7b8aa1e26e3", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6162db9-e712-4895-aeb1-1a230aaa3a04", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659f4d6e-2a45-4f6e-9e97-b348975bb1ba", 3, 0, 0.0, 296.6666666666667, 178, 361, 351.0, 361.0, 361.0, 361.0, 0.04454210713861504, 0.02863628307251455, 0.028563786153343627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 332.7647058823529, 200, 989, 205.0, 832.1999999999998, 989.0, 989.0, 0.08420510381993977, 11.96674583339525, 0.18684458554990885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a90424a-0f62-417b-b149-4b09a16f2bf5", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5639840-f3f4-4b5a-8e54-3ef30d6efc6c", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 135.57894736842104, 102, 303, 104.0, 302.0, 303.0, 303.0, 0.11791355074937164, 0.09776230916622708, 0.0419145824929407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 115.77777777777777, 101, 301, 104.0, 132.70000000000027, 301.0, 301.0, 0.09698902946311184, 0.07529910002263078, 0.034476569066965536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bc48740-26a5-4f18-a8d7-25644c8b5441", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 116.66666666666664, 100, 315, 102.0, 189.60000000000008, 315.0, 315.0, 0.07365108046135037, 0.05473483616317151, 0.03696938999720126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 180.66666666666666, 98, 305, 103.0, 304.4, 305.0, 305.0, 0.07365252701820199, 0.04183233370486942, 0.040767824525309464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 313.4666666666667, 99, 882, 296.0, 777.6, 882.0, 882.0, 0.07343545757633616, 13.231305283130407, 0.041909845124619975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 258.8666666666667, 99, 692, 105.0, 692.0, 692.0, 692.0, 0.07343941248470012, 4.334560511015912, 0.041983820379436966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e744038-d8f1-4c8a-be44-58207f41fa1c", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.30935808197989173], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.46403712296983757], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 12, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
