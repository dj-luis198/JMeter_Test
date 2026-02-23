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

    var data = {"OkPercent": 97.91976225854383, "KoPercent": 2.0802377414561666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8166772756206238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46551724137931033, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac5bc18e-441d-4808-bcd1-77745e49a49d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/231e678a-2b8c-407c-b2db-db47fe674b2d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5475b771-b345-4e74-a73b-4980989ca2f6"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160c2bfb-2b3e-4377-ac32-638a3653d368"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdc82d46-792c-455f-b7bf-f2c0020f2d80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9857cfa2-0597-4360-a42d-c44d376dff10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d2d07d1-d05a-40ee-84ed-761a9789cfba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afca22b8-0b7e-405d-9514-5cc74d464721"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8b6a70a-91fe-481c-a526-558838c86320"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e4aee3e-434c-454e-b309-e7e7458bbd2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79defc3e-2879-4265-89ef-d7c008810fa5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99503278-9acb-49c8-9f81-36e34fd12acb"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c404adcc-760f-49b1-945b-e07a4957dc27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9c72f87-6dd9-4db4-9268-0f02784c9134"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9857cfa2-0597-4360-a42d-c44d376dff10"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76ca82c6-98ce-4f42-b9e8-0a6bb63489dc"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5475b771-b345-4e74-a73b-4980989ca2f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac5bc18e-441d-4808-bcd1-77745e49a49d"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d2d07d1-d05a-40ee-84ed-761a9789cfba"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=231e678a-2b8c-407c-b2db-db47fe674b2d"], "isController": false}, {"data": [0.8620689655172413, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdc82d46-792c-455f-b7bf-f2c0020f2d80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3eefdb50-98dc-4ab3-b626-eec1213d118f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9403409090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8b6a70a-91fe-481c-a526-558838c86320"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3eefdb50-98dc-4ab3-b626-eec1213d118f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99503278-9acb-49c8-9f81-36e34fd12acb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79defc3e-2879-4265-89ef-d7c008810fa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/160c2bfb-2b3e-4377-ac32-638a3653d368"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c404adcc-760f-49b1-945b-e07a4957dc27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cd10dd6-f472-4990-88c8-6ddb34baee18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1346, 28, 2.0802377414561666, 276.1589895988113, 81, 1916, 100.5, 666.0, 830.0, 1326.3699999999992, 5.306692109350975, 758.1158079719644, 3.8733388249974374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1243.224137931034, 995, 1659, 1214.0, 1449.3, 1551.4, 1659.0, 0.25414074138988696, 305.8177399411752, 1.249608039939532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac5bc18e-441d-4808-bcd1-77745e49a49d", 3, 0, 0.0, 303.0, 219, 363, 327.0, 363.0, 363.0, 363.0, 0.02292754132689324, 0.02750260084296927, 0.014702882947259011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/231e678a-2b8c-407c-b2db-db47fe674b2d", 3, 0, 0.0, 326.3333333333333, 159, 462, 358.0, 462.0, 462.0, 462.0, 0.04855468876444502, 0.03121598642896449, 0.031136958615220277], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 495.79999999999995, 87, 1916, 403.0, 1261.4000000000003, 1916.0, 1916.0, 0.09343407603042214, 0.01901529437962888, 0.06261178024616765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 495.79999999999995, 87, 1916, 403.0, 1261.4000000000003, 1916.0, 1916.0, 0.09341312890389035, 0.01901103131208081, 0.06259774321664996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 92.94736842105263, 81, 245, 84.0, 92.0, 245.0, 245.0, 0.10371575333118623, 0.03595081416866365, 0.05869194306005142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 94.36842105263158, 83, 247, 85.0, 94.0, 247.0, 247.0, 0.10371518717861938, 0.0770773998466107, 0.05206016231426794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 154.31578947368422, 82, 406, 90.0, 252.0, 406.0, 406.0, 0.10361903099845117, 1.6300078839085097, 0.060549175751510656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 140.57894736842104, 82, 819, 85.0, 245.0, 819.0, 819.0, 0.10362298685078834, 4.933835742908642, 0.06045029300762993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5475b771-b345-4e74-a73b-4980989ca2f6", 3, 0, 0.0, 352.33333333333337, 180, 626, 251.0, 626.0, 626.0, 626.0, 0.0733066171439742, 0.03245345029811358, 0.04700977727006158], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 191.26666666666665, 83, 319, 190.0, 286.0, 319.0, 319.0, 0.09432657116625373, 0.15705742562349864, 0.060962231247877655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160c2bfb-2b3e-4377-ac32-638a3653d368", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdc82d46-792c-455f-b7bf-f2c0020f2d80", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 88.09090909090908, 82, 110, 85.0, 102.69999999999999, 109.39999999999999, 110.0, 0.120598166907863, 0.08962422364930053, 0.060534626748673416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 515.1666666666667, 405, 580, 564.0, 580.0, 580.0, 580.0, 0.031800884064577, 9.350515803714343, 0.018136441693079066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 113.90909090909089, 81, 252, 84.5, 247.0, 251.25, 252.0, 0.12049050589581953, 0.04046658236895288, 0.06825727256047802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 644.6666666666666, 566, 754, 617.0, 754.0, 754.0, 754.0, 0.03177040586693495, 28.587067045484634, 0.01808803380900691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 167.83333333333334, 85, 254, 166.5, 254.0, 254.0, 254.0, 0.03185457325490029, 0.05636766282996029, 0.01763822562063327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9857cfa2-0597-4360-a42d-c44d376dff10", 3, 0, 0.0, 417.33333333333337, 226, 757, 269.0, 757.0, 757.0, 757.0, 0.024382711032363988, 0.024454144756091614, 0.015636048415936542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 121.71428571428571, 83, 259, 86.0, 255.5, 259.0, 259.0, 0.07189626396199769, 0.05343071960457055, 0.03608855437154962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 142.9285714285714, 82, 261, 84.0, 255.5, 261.0, 261.0, 0.07183244568954017, 0.01922079113177149, 0.04096694168231588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 143.50000000000003, 82, 261, 85.0, 256.5, 261.0, 261.0, 0.07183207712712739, 0.01936098953817105, 0.04222940471731512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 143.5, 83, 253, 85.0, 251.0, 253.0, 253.0, 0.07189774087027079, 0.019378687968940177, 0.042338220453880165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d2d07d1-d05a-40ee-84ed-761a9789cfba", 3, 0, 0.0, 341.6666666666667, 190, 447, 388.0, 447.0, 447.0, 447.0, 0.02400019200153601, 0.024070505064040515, 0.015390748125985008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 114.0, 83, 253, 86.5, 253.0, 253.0, 253.0, 0.03185406590606236, 0.023672797025892044, 0.017886804585923687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afca22b8-0b7e-405d-9514-5cc74d464721", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 421.61538461538464, 83, 744, 569.0, 737.2, 744.0, 744.0, 0.12800567163591248, 70.89310264824041, 0.06848380359006676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 121.68181818181819, 81, 565, 84.0, 251.2, 518.1999999999994, 565.0, 0.120598166907863, 4.963502138219203, 0.07042744512783405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 385.92307692307696, 83, 589, 564.0, 585.8, 589.0, 589.0, 0.12800189048945954, 23.174380729315384, 0.06860678250017231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 129.54545454545453, 81, 578, 85.0, 253.4, 529.3999999999993, 578.0, 0.12048720644935157, 1.641327984659788, 0.07048030924136874], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 364.33333333333337, 85, 588, 397.0, 576.0, 588.0, 588.0, 0.09342360129298263, 0.019013162606892172, 0.06307917766989082], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 313.3571428571429, 166, 520, 336.0, 510.0, 520.0, 520.0, 0.07180002666858133, 0.11127601789359237, 0.16147994279076447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 459.04347826086956, 97, 1021, 464.0, 734.2, 966.9999999999992, 1021.0, 0.10878150525225486, 0.06681988945670733, 0.04918538762870508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 85.3076923076923, 82, 89, 85.0, 88.6, 89.0, 89.0, 0.12800189048945954, 0.09512640494382686, 0.06425094893709199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 147.76923076923075, 83, 253, 85.0, 252.6, 253.0, 253.0, 0.12800315084679006, 0.1525614476664041, 0.06638624950768018], "isController": false}, {"data": ["login", 23, 0, 0.0, 2162.0, 1555, 3149, 2106.0, 2881.6000000000004, 3122.7999999999997, 3149.0, 0.11126968384896349, 34.87843484676229, 0.21601493523378726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 98.27272727272727, 86, 256, 88.0, 118.09999999999998, 236.79999999999973, 256.0, 0.12514220705346984, 0.10131141567121729, 0.04448414391353811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8b6a70a-91fe-481c-a526-558838c86320", 3, 0, 0.0, 274.3333333333333, 208, 368, 247.0, 368.0, 368.0, 368.0, 0.017450281240365993, 0.02405662143650715, 0.011190447279791993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e4aee3e-434c-454e-b309-e7e7458bbd2e", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79defc3e-2879-4265-89ef-d7c008810fa5", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99503278-9acb-49c8-9f81-36e34fd12acb", 3, 0, 0.0, 364.3333333333333, 177, 507, 409.0, 507.0, 507.0, 507.0, 0.0331619963521804, 0.02764579188083789, 0.021265993754490686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 510.6923076923077, 168, 830, 657.0, 823.6, 830.0, 830.0, 0.12789233433023767, 94.23235354790552, 0.2674959633981977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 421.9166666666667, 83, 901, 369.5, 883.9000000000001, 901.0, 901.0, 0.0635105453968086, 37.9988430826431, 0.09264538787742466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 271.68421052631584, 168, 913, 178.0, 500.0, 913.0, 913.0, 0.10357214890404312, 6.673557706721833, 0.23154145850027527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c404adcc-760f-49b1-945b-e07a4957dc27", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9c72f87-6dd9-4db4-9268-0f02784c9134", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["register", 25, 7, 28.0, 925.0799999999999, 96, 1614, 946.0, 1435.8000000000002, 1574.3999999999999, 1614.0, 0.10345840765095617, 0.032524736905269344, 0.04667752376439624], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 234.3181818181818, 168, 685, 174.0, 347.0, 634.7499999999993, 685.0, 0.12043180275460379, 6.7271757356604045, 0.26945332857080295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 87.84615384615384, 84, 96, 88.0, 93.6, 96.0, 96.0, 0.08321864097557852, 0.06460822224178216, 0.02958162628428768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9857cfa2-0597-4360-a42d-c44d376dff10", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 358.21052631578954, 166, 927, 333.0, 831.0, 927.0, 927.0, 0.09515700906495718, 24.08292530331297, 0.20888469881554567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 84.83333333333333, 83, 86, 85.0, 86.0, 86.0, 86.0, 0.02831377323499016, 0.021041778742019054, 0.01421218695584467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 111.5, 82, 253, 83.5, 253.0, 253.0, 253.0, 0.02829161106579214, 0.007570216242213913, 0.01613505943595958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 83.5, 82, 86, 83.0, 86.0, 86.0, 86.0, 0.028314307691581685, 0.007631590744996626, 0.016645716045246263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 112.16666666666667, 83, 251, 84.5, 251.0, 251.0, 251.0, 0.028291877873393847, 0.007625545208063186, 0.016660158552398916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.0, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.057574943384639005, 0.016980110256016583, 0.035590760900855944], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 791.7586206896551, 648, 1301, 674.5, 1080.5, 1188.4, 1301.0, 0.2430999434163925, 290.83204754070874, 0.4800274273319781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 925.0799999999999, 96, 1614, 946.0, 1435.8000000000002, 1574.3999999999999, 1614.0, 0.10553376869530712, 0.033177178533587176, 0.047613868298078024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 128.81818181818184, 83, 253, 85.0, 251.6, 253.0, 253.0, 0.05867073450425896, 0.01581359640935105, 0.03454927041608218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 130.63636363636365, 83, 267, 85.0, 263.40000000000003, 267.0, 267.0, 0.05867073450425896, 0.01581359640935105, 0.034491974776917865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76ca82c6-98ce-4f42-b9e8-0a6bb63489dc", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 198.2307692307692, 83, 573, 86.0, 571.0, 573.0, 573.0, 0.08146026932018273, 11.295208001748264, 0.046812729890279285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 185.46153846153842, 82, 576, 85.0, 570.0, 576.0, 576.0, 0.08146077976764879, 3.703528191696013, 0.0468925747715965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 114.45454545454547, 84, 250, 85.0, 249.2, 250.0, 250.0, 0.058638207589916364, 0.015690301640270587, 0.03344210276612417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 111.76923076923076, 83, 255, 85.0, 254.2, 255.0, 255.0, 0.08137307677862768, 0.060473546316929354, 0.04084547017989709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 127.36363636363636, 83, 367, 85.0, 345.20000000000005, 367.0, 367.0, 0.05866948280184115, 0.04360105118379015, 0.02944933023451792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 141.07692307692307, 81, 335, 86.0, 299.4, 335.0, 335.0, 0.08146077976764879, 0.040620241593874146, 0.04540557285726818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5475b771-b345-4e74-a73b-4980989ca2f6", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 136.45454545454547, 84, 410, 89.0, 381.2000000000001, 410.0, 410.0, 0.057968570495051594, 0.0456276052920035, 0.02060601529316287], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 387.73333333333335, 83, 757, 388.0, 678.4000000000001, 757.0, 757.0, 0.09360900144157862, 0.01853897020737514, 0.06369800019969919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1300.217391304348, 703, 1913, 1273.0, 1870.8, 1906.8, 1913.0, 0.11290172150581444, 0.05843546132625161, 0.051930381669178315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac5bc18e-441d-4808-bcd1-77745e49a49d", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 274.8181818181818, 169, 621, 173.0, 602.0000000000001, 621.0, 621.0, 0.058610712972682076, 0.09083515770277975, 0.13181686716414728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d2d07d1-d05a-40ee-84ed-761a9789cfba", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 804.8135593220339, 425, 1733, 713.0, 1238.0, 1414.0, 1733.0, 0.28144155317575786, 92.44870548811029, 1.0215160054976506], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 154.01724137931035, 84, 598, 86.0, 342.1, 347.34999999999997, 598.0, 0.24386347009308856, 0.18123056712972696, 0.117883220406327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=231e678a-2b8c-407c-b2db-db47fe674b2d", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 466.39655172413796, 403, 675, 418.0, 580.4, 670.05, 675.0, 0.24408514363148193, 71.76913661719033, 0.12275766500997382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdc82d46-792c-455f-b7bf-f2c0020f2d80", 3, 0, 0.0, 414.6666666666667, 319, 542, 383.0, 542.0, 542.0, 542.0, 0.04591087169441724, 0.03731752819692703, 0.0294415420696621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3eefdb50-98dc-4ab3-b626-eec1213d118f", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 117.6724137931035, 82, 342, 87.0, 252.2, 257.19999999999993, 342.0, 0.24442459079952125, 0.43251695168821536, 0.11887055294742342], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 632.8965517241376, 561, 851, 582.0, 750.5, 837.4, 851.0, 0.24374458929036705, 219.32180990075813, 0.12234835829614127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 91.4736842105263, 85, 100, 89.0, 99.0, 100.0, 100.0, 0.09539637192534983, 0.07126779738563732, 0.03391042908283919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, 5.113636363636363, 145.9090909090909, 84, 586, 93.5, 255.20000000000005, 335.20000000000005, 567.5199999999998, 0.7282989667258409, 1.6363167275479085, 0.3483084635788446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 109.0, 90, 160, 100.0, 160.0, 160.0, 160.0, 0.027692904154858717, 0.02144577440898727, 0.009843962023797436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 91.73684210526316, 84, 128, 90.0, 101.0, 128.0, 128.0, 0.10730340885987304, 0.08707923121343213, 0.038143008618157996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8b6a70a-91fe-481c-a526-558838c86320", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eefdb50-98dc-4ab3-b626-eec1213d118f", 3, 0, 0.0, 252.33333333333331, 168, 388, 201.0, 388.0, 388.0, 388.0, 0.05530565592507927, 0.03440400666433154, 0.03546619211341347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99503278-9acb-49c8-9f81-36e34fd12acb", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 198.16666666666669, 168, 337, 171.0, 337.0, 337.0, 337.0, 0.02828000980373673, 0.043828491756377146, 0.06360240486133369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79defc3e-2879-4265-89ef-d7c008810fa5", 3, 0, 0.0, 284.0, 173, 504, 175.0, 504.0, 504.0, 504.0, 0.05890090903736281, 0.03786760916301808, 0.03777174179804842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/160c2bfb-2b3e-4377-ac32-638a3653d368", 3, 0, 0.0, 271.0, 176, 373, 264.0, 373.0, 373.0, 373.0, 0.03998773709395785, 0.025708261966330328, 0.02564317775882063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 330.9230769230769, 168, 660, 180.0, 660.0, 660.0, 660.0, 0.0813298048710297, 15.075687794038526, 0.17971125377714384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.14285714285714, 84, 91, 89.0, 91.0, 91.0, 91.0, 0.07104038645970234, 0.058899695414343055, 0.02525263737434732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c404adcc-760f-49b1-945b-e07a4957dc27", 3, 0, 0.0, 344.3333333333333, 222, 487, 324.0, 487.0, 487.0, 487.0, 0.030643826801090922, 0.025546497538279245, 0.019651151952522497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cd10dd6-f472-4990-88c8-6ddb34baee18", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 88.61538461538461, 85, 100, 87.0, 97.6, 100.0, 100.0, 0.13527012403229835, 0.10501928574773163, 0.04808430190210605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 94.05263157894737, 82, 249, 85.0, 88.0, 249.0, 249.0, 0.09519753488488614, 0.07074738676503745, 0.04778470012776511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 126.42105263157895, 81, 247, 85.0, 246.0, 247.0, 247.0, 0.09519944283273457, 0.05557541486915087, 0.05261021840756385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 245.9473684210526, 82, 842, 88.0, 745.0, 842.0, 842.0, 0.0951984888492507, 18.05389236558224, 0.05424395802748731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 217.10526315789477, 82, 627, 84.0, 581.0, 627.0, 627.0, 0.0951984888492507, 5.913207944814939, 0.05433692530175416], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5200594353640416], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22288261515601784], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.714285714285714, 0.22288261515601784], "isController": false}, {"data": ["401/Unauthorized", 15, 53.57142857142857, 1.1144130757800892], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1346, 28, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
