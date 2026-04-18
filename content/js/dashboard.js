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

    var data = {"OkPercent": 99.22178988326849, "KoPercent": 0.7782101167315175};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7575554063129617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b5f9958-3fff-42f2-88e8-d465504b433d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db89245b-58b0-4561-a200-b6456d34f58e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1e8f80a-3e55-44ed-ac83-9cabbe2083d6"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dab4e48-470a-4ed8-bb32-7713a42c6a59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e54aa19-9579-43fb-85e6-95368ba666c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e90fbba0-1ebe-4c30-9a25-8d640880dc29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba70718b-1feb-4e03-9b51-96b7ee66aabc"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff570330-c8fb-45ab-973d-6a0c875d5571"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/854e68c8-a1df-487c-b812-ac9ad4248352"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77670d58-c3d4-4eba-bb18-705a23a7656a"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1334a9aa-68ed-496e-9c31-1df5c648f121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d35f350-89de-4bc2-9cc8-d83dd244a785"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ac33d16-79ef-4588-9952-e5e11ee27e96"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/20b1b2d7-cc12-4ef0-915a-28c2576243a4"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe72ab97-554b-485a-8b51-65de72c827fa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e95af6c-cfd9-443c-9d6a-b3db37ad02fb"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d35f350-89de-4bc2-9cc8-d83dd244a785"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dab4e48-470a-4ed8-bb32-7713a42c6a59"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e95af6c-cfd9-443c-9d6a-b3db37ad02fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b5f9958-3fff-42f2-88e8-d465504b433d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba70718b-1feb-4e03-9b51-96b7ee66aabc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db89245b-58b0-4561-a200-b6456d34f58e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e90fbba0-1ebe-4c30-9a25-8d640880dc29"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1e8f80a-3e55-44ed-ac83-9cabbe2083d6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff570330-c8fb-45ab-973d-6a0c875d5571"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77670d58-c3d4-4eba-bb18-705a23a7656a"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1334a9aa-68ed-496e-9c31-1df5c648f121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ac33d16-79ef-4588-9952-e5e11ee27e96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 10, 0.7782101167315175, 459.4669260700388, 136, 2491, 153.0, 1277.6000000000004, 1636.0, 2064.480000000003, 5.096880391884656, 705.6117124129861, 3.728333300279634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2278.7999999999993, 1686, 3068, 2235.0, 2813.2, 2955.5999999999995, 3068.0, 0.26042899758511295, 313.38361357811687, 1.2805273465244567], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b5f9958-3fff-42f2-88e8-d465504b433d", 3, 0, 0.0, 617.0, 268, 1311, 272.0, 1311.0, 1311.0, 1311.0, 0.020388191159680314, 0.024098151725520576, 0.013074458523623118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db89245b-58b0-4561-a200-b6456d34f58e", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1e8f80a-3e55-44ed-ac83-9cabbe2083d6", 3, 0, 0.0, 482.3333333333333, 264, 725, 458.0, 725.0, 725.0, 725.0, 0.020517730738980267, 0.024251263122798617, 0.013157529152275757], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 638.1666666666667, 445, 1789, 515.0, 1466.800000000001, 1789.0, 1789.0, 0.06261348694508798, 0.011312006918790309, 0.04255760440798948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 638.1666666666667, 445, 1789, 515.0, 1466.800000000001, 1789.0, 1789.0, 0.06414402471683085, 0.011588520090443075, 0.04359789179972097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dab4e48-470a-4ed8-bb32-7713a42c6a59", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e54aa19-9579-43fb-85e6-95368ba666c4", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 184.47368421052627, 138, 418, 141.0, 415.0, 418.0, 418.0, 0.0989861731945443, 0.034311407895970744, 0.056015510221624834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e90fbba0-1ebe-4c30-9a25-8d640880dc29", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 142.6315789473684, 138, 150, 142.0, 148.0, 150.0, 150.0, 0.09898204778228116, 0.0735599007444492, 0.04968434820321535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 205.6842105263158, 139, 1092, 141.0, 421.0, 1092.0, 1092.0, 0.09898462612464769, 1.5571050936707145, 0.057841088322939944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 257.15789473684214, 137, 1523, 141.0, 418.0, 1523.0, 1523.0, 0.09898204778228116, 4.712865167240588, 0.05774291952759515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba70718b-1feb-4e03-9b51-96b7ee66aabc", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 257.91666666666663, 224, 369, 250.0, 339.3000000000001, 369.0, 369.0, 0.06269002915086355, 0.15799540305770618, 0.040528124314327806], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 140.45454545454547, 138, 148, 140.0, 147.0, 148.0, 148.0, 0.17056908047759342, 0.1267608107846178, 0.08561768297410452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 165.0, 138, 418, 139.0, 362.8000000000002, 418.0, 418.0, 0.1698395787978446, 0.06863545478407214, 0.09556491924900026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1032.25, 821, 1108, 1100.0, 1108.0, 1108.0, 1108.0, 0.06951806600740368, 20.440619623212083, 0.039647022019847405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1497.0, 1267, 1675, 1523.0, 1675.0, 1675.0, 1675.0, 0.06867896020054257, 61.79744911318293, 0.03910140019230109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 214.5, 141, 432, 142.5, 432.0, 432.0, 432.0, 0.0699912510936133, 0.1238517060367454, 0.03875492125984252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 159.58823529411765, 138, 410, 142.0, 213.19999999999982, 410.0, 410.0, 0.09040918131827223, 0.06718885447578629, 0.045381171091398366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 173.9411764705882, 136, 411, 141.0, 411.0, 411.0, 411.0, 0.09040966213377438, 0.032179358144581005, 0.0511151134375349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff570330-c8fb-45ab-973d-6a0c875d5571", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 258.4117647058823, 137, 1581, 141.0, 652.1999999999991, 1581.0, 1581.0, 0.09040966213377438, 4.808274387009195, 0.05269395864023869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/854e68c8-a1df-487c-b812-ac9ad4248352", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 216.88235294117644, 137, 1149, 141.0, 571.3999999999995, 1149.0, 1149.0, 0.09040821970261013, 1.5866414044385118, 0.052781407217234996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 142.25, 140, 146, 141.5, 146.0, 146.0, 146.0, 0.07034946094725548, 0.052281191192247486, 0.03950287113737491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 984.4117647058825, 138, 1955, 1245.0, 1925.3999999999999, 1955.0, 1955.0, 0.15619688157519962, 82.69158739100673, 0.0839307002673723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 315.0, 139, 1507, 140.0, 1290.2000000000007, 1507.0, 1507.0, 0.17057437042550552, 13.994806325401624, 0.09894646096948269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 687.7058823529411, 140, 1259, 820.0, 1165.3999999999999, 1259.0, 1259.0, 0.15580321137913336, 26.96512528411174, 0.0838713174307134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 228.90909090909088, 138, 1109, 140.0, 916.0000000000007, 1109.0, 1109.0, 0.17056114617090226, 4.600941429690044, 0.09910535348797544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77670d58-c3d4-4eba-bb18-705a23a7656a", 3, 0, 0.0, 399.0, 243, 590, 364.0, 590.0, 590.0, 590.0, 0.024215420379697792, 0.024286363994091436, 0.01552876892838693], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 537.2499999999999, 412, 1349, 456.5, 1113.2000000000007, 1349.0, 1349.0, 0.0641543125063486, 0.011590378724291495, 0.04423139123972863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1334a9aa-68ed-496e-9c31-1df5c648f121", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d35f350-89de-4bc2-9cc8-d83dd244a785", 3, 0, 0.0, 326.0, 243, 445, 290.0, 445.0, 445.0, 445.0, 0.0280334532542167, 0.028298091973087885, 0.01797718193711162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 436.2352941176471, 280, 1722, 287.0, 1014.7999999999994, 1722.0, 1722.0, 0.09034047731656898, 6.489339989743699, 0.2018181768361702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ac33d16-79ef-4588-9952-e5e11ee27e96", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 701.4499999999999, 164, 1772, 632.0, 1590.3000000000009, 1764.9499999999998, 1772.0, 0.09422628442203952, 0.05787923134908483, 0.04260426727285577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 141.1764705882353, 137, 148, 141.0, 144.0, 148.0, 148.0, 0.15619975191804109, 0.11608204219690357, 0.07840495359948546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 239.52941176470588, 138, 426, 145.0, 421.2, 426.0, 426.0, 0.15619975191804109, 0.1797984046951808, 0.08136600128635091], "isController": false}, {"data": ["login", 20, 0, 0.0, 2758.95, 1474, 3943, 2677.5, 3658.8, 3929.25, 3943.0, 0.0947889760420863, 22.81161505604398, 0.17445244555558187], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 145.1818181818182, 140, 154, 144.0, 153.4, 154.0, 154.0, 0.1691110906127971, 0.13690731847461796, 0.06011370799126771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20b1b2d7-cc12-4ef0-915a-28c2576243a4", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.559257333625219, 1.0449731830122593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1143.4117647058827, 283, 2098, 1389.0, 2067.6, 2098.0, 2098.0, 0.15560498302075038, 109.60380404126735, 0.326539845745119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe72ab97-554b-485a-8b51-65de72c827fa", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e95af6c-cfd9-443c-9d6a-b3db37ad02fb", 3, 0, 0.0, 668.3333333333334, 270, 1193, 542.0, 1193.0, 1193.0, 1193.0, 0.0833032516035876, 0.03769255199511288, 0.053420379446311055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 445.3157894736842, 280, 1673, 288.0, 570.0, 1673.0, 1673.0, 0.0989068193649141, 6.372952319755336, 0.22111184767048414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1640.0, 1409, 1821, 1665.0, 1821.0, 1821.0, 1821.0, 0.06851192107426693, 81.96407620238422, 0.15448635328172103], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1135.3333333333335, 340, 2491, 1138.0, 1893.2, 2434.499999999999, 2491.0, 0.08590502994403901, 0.027132950305985535, 0.03875793343178323], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d35f350-89de-4bc2-9cc8-d83dd244a785", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 482.6363636363636, 278, 1647, 284.0, 1431.2000000000007, 1647.0, 1647.0, 0.16946802446502027, 18.669917933183378, 0.3771957423084626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 168.05882352941177, 142, 427, 149.0, 259.79999999999984, 427.0, 427.0, 0.11775381141380767, 0.09142019538474326, 0.04185780015100195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dab4e48-470a-4ed8-bb32-7713a42c6a59", 3, 0, 0.0, 351.6666666666667, 224, 575, 256.0, 575.0, 575.0, 575.0, 0.02389524325357632, 0.028243368572179565, 0.015323447008315545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 568.1176470588235, 282, 1815, 556.0, 1561.3999999999999, 1815.0, 1815.0, 0.10013665708496301, 14.230846701454338, 0.22219546491388248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e95af6c-cfd9-443c-9d6a-b3db37ad02fb", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 164.83333333333331, 139, 421, 140.5, 339.10000000000025, 421.0, 421.0, 0.09333146670399925, 0.06936059195482756, 0.04684802137290587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b5f9958-3fff-42f2-88e8-d465504b433d", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 186.41666666666666, 138, 414, 141.5, 413.7, 414.0, 414.0, 0.09333219260653482, 0.024973653099795445, 0.05322851609591438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 186.08333333333331, 137, 416, 140.0, 415.4, 416.0, 416.0, 0.09313082552715927, 0.02510166781786715, 0.054750739225927623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 162.99999999999997, 138, 414, 139.5, 333.3000000000003, 414.0, 414.0, 0.0931322711080412, 0.02510205744708923, 0.05484253855287973], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1598.2181818181818, 1106, 2481, 1504.0, 2232.8, 2380.9999999999995, 2481.0, 0.2650551314673452, 317.0980853079941, 0.5233803474872774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1135.3333333333335, 340, 2491, 1138.0, 1893.2, 2434.499999999999, 2491.0, 0.08417339719822835, 0.02658601719542257, 0.03797666943904443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba70718b-1feb-4e03-9b51-96b7ee66aabc", 3, 0, 0.0, 663.6666666666667, 342, 1280, 369.0, 1280.0, 1280.0, 1280.0, 0.020186930980882978, 0.023860269007677765, 0.012945395192818837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db89245b-58b0-4561-a200-b6456d34f58e", 3, 0, 0.0, 596.6666666666666, 260, 1063, 467.0, 1063.0, 1063.0, 1063.0, 0.032268473701193935, 0.026900898811444553, 0.02069299908572658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 144.0, 139, 147, 146.0, 147.0, 147.0, 147.0, 0.03487188071027046, 0.009399061597690087, 0.02053490631669247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 198.4, 139, 417, 146.0, 417.0, 417.0, 417.0, 0.0348713942978296, 0.009398930494336887, 0.020500565788372484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 222.7058823529412, 137, 427, 141.0, 424.6, 427.0, 427.0, 0.11409089688867413, 0.030751062052025453, 0.0670729686786932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 189.76470588235293, 137, 425, 141.0, 421.8, 425.0, 425.0, 0.11408706856632822, 0.030750030199518153, 0.06718213119677335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 198.4, 139, 417, 141.0, 417.0, 417.0, 417.0, 0.03486944878375363, 0.009330301725340327, 0.01988648250948449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 157.11764705882354, 139, 412, 141.0, 198.3999999999998, 412.0, 412.0, 0.11408706856632822, 0.08478540935446853, 0.05726636058895772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 200.4, 141, 434, 142.0, 434.0, 434.0, 434.0, 0.0348728535758624, 0.02591625153440556, 0.01750453783007156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 197.41176470588235, 137, 566, 140.0, 447.5999999999999, 566.0, 566.0, 0.1140885998644359, 0.03052761363560101, 0.0650661546101861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 200.2, 143, 425, 144.0, 425.0, 425.0, 425.0, 0.03310030717085055, 0.026053562089556188, 0.01176612481463828], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 684.6666666666667, 445, 1311, 572.5, 1301.7, 1311.0, 1311.0, 0.06440601552184974, 0.01163585241361543, 0.0438388601745403], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1379.95, 841, 1995, 1319.0, 1921.2, 1991.6, 1995.0, 0.09516106009420945, 0.049253283056573255, 0.04377037041442642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e90fbba0-1ebe-4c30-9a25-8d640880dc29", 3, 0, 0.0, 440.66666666666663, 253, 744, 325.0, 744.0, 744.0, 744.0, 0.0184795062275936, 0.02547549116987594, 0.011850464605585738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 401.2, 282, 852, 289.0, 852.0, 852.0, 852.0, 0.03483495199743615, 0.05398737189446403, 0.07834462348642134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1e8f80a-3e55-44ed-ac83-9cabbe2083d6", 1, 0, 0.0, 1349.0, 1349, 1349, 1349.0, 1349.0, 1349.0, 1349.0, 0.7412898443291327, 0.1339244347664937, 0.5110845997034841], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1363.9666666666665, 728, 4224, 1095.0, 2438.4, 2614.1, 4224.0, 0.2820715333408553, 85.42342646688951, 1.027081952358118], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 260.8, 139, 575, 145.0, 565.8, 569.2, 575.0, 0.26664985964521026, 0.19816459295898925, 0.12889812551208893], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 919.2545454545453, 684, 1401, 836.0, 1161.8, 1233.9999999999998, 1401.0, 0.2659638772697599, 78.2022107491719, 0.13376112968156872], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 223.56363636363636, 138, 565, 146.0, 424.0, 430.0, 565.0, 0.26724326425499867, 0.4728953074512281, 0.12996791562401303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff570330-c8fb-45ab-973d-6a0c875d5571", 3, 0, 0.0, 370.0, 228, 499, 383.0, 499.0, 499.0, 499.0, 0.0162458099348543, 0.02239616050589452, 0.010418048688692375], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1333.6363636363637, 960, 1906, 1259.0, 1729.6, 1853.6, 1906.0, 0.2658289028516191, 239.1933140632552, 0.13343364850169165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 165.70588235294122, 141, 431, 149.0, 221.3999999999998, 431.0, 431.0, 0.10330955187962614, 0.07717949920694726, 0.036723317269710856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77670d58-c3d4-4eba-bb18-705a23a7656a", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, 2.857142857142857, 208.96, 139, 2160, 147.0, 330.20000000000005, 415.59999999999997, 985.0400000000141, 0.744883713011203, 1.5494121603862328, 0.3602044812204175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 192.33333333333331, 141, 434, 146.5, 430.7, 434.0, 434.0, 0.08989302729751596, 0.06961442445989273, 0.03195416204716388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1334a9aa-68ed-496e-9c31-1df5c648f121", 3, 0, 0.0, 342.0, 226, 570, 230.0, 570.0, 570.0, 570.0, 0.06874899741045443, 0.04500463339597131, 0.044087084927928136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 161.4736842105263, 140, 420, 147.0, 156.0, 420.0, 420.0, 0.09682268708436313, 0.07857387985068921, 0.03441743954951971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 376.0833333333333, 281, 836, 286.0, 752.3000000000003, 836.0, 836.0, 0.09302974626136706, 0.14417793683280228, 0.20922607972649251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 423.47058823529414, 281, 835, 289.0, 732.5999999999999, 835.0, 835.0, 0.11397845136807665, 0.17664433820423597, 0.2563402084967583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 145.99999999999997, 141, 156, 145.0, 152.0, 156.0, 156.0, 0.09230552041309435, 0.07653065120187218, 0.03281172795934213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 151.2941176470588, 140, 171, 148.0, 171.0, 171.0, 171.0, 0.15224653191355977, 0.1181992117883594, 0.05411888439114821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ac33d16-79ef-4588-9952-e5e11ee27e96", 3, 0, 0.0, 334.0, 247, 468, 287.0, 468.0, 468.0, 468.0, 0.05479652224738803, 0.03522888393183313, 0.035139696883904434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 141.00000000000003, 138, 149, 141.0, 145.0, 149.0, 149.0, 0.10051499151535219, 0.07469912943670216, 0.05045381410047952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 238.58823529411765, 137, 431, 141.0, 425.4, 431.0, 431.0, 0.1005167744758346, 0.04465744104986814, 0.05633281547485307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 400.52941176470586, 138, 1677, 144.0, 1423.3999999999999, 1677.0, 1677.0, 0.10022284845126221, 10.633328721362794, 0.057906790540142195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 311.8823529411765, 137, 1122, 140.0, 1111.6, 1122.0, 1122.0, 0.10037078147509623, 3.4959106286753414, 0.05809028167288571], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 50.0, 0.38910505836575876], "isController": false}, {"data": ["401/Unauthorized", 5, 50.0, 0.38910505836575876], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 10, "406/Not Acceptable", 5, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
