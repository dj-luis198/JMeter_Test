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

    var data = {"OkPercent": 96.78597516435354, "KoPercent": 3.214024835646457};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7935323383084577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47413793103448276, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c621c929-9c14-4373-ab0a-e7baec1ac202"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb9f1861-21b1-43e6-9f7d-5fb41b30a044"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b6bfc3c-afd4-40ec-b998-69480fa6a24c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d8e7b8b-294e-4203-a1ec-ddefc090e991"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43771b32-c007-4b27-8ef5-d9aeb9011365"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=553ddd05-a777-4c10-9550-36c28d64b85e"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b2e9608-74ba-4408-9306-8e10c05bad3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/278fef4b-d3b9-4cf1-95bd-552495c29b30"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.12, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c6b567a-d0ba-45ed-a3a0-1f741bf87331"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=737e8d7a-80a3-4273-bb1d-a7d99fe7c7d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76759fef-57a7-4194-aa1c-5e02e92c21bb"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/553ddd05-a777-4c10-9550-36c28d64b85e"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d4b23a6-461d-4fd5-88ca-4bebfd0c0d2c"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b2e9608-74ba-4408-9306-8e10c05bad3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92a8da63-02df-426c-9a04-c2b00239294b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ef3f340-3e29-490c-b100-dca9837a7592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43771b32-c007-4b27-8ef5-d9aeb9011365"], "isController": false}, {"data": [0.46, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d8e7b8b-294e-4203-a1ec-ddefc090e991"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/94c9e7a8-60bb-49c9-9673-89fafe209810"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb9f1861-21b1-43e6-9f7d-5fb41b30a044"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c9e5b73-f648-4447-8c46-0547fa4d03d7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=278fef4b-d3b9-4cf1-95bd-552495c29b30"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c6b567a-d0ba-45ed-a3a0-1f741bf87331"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76759fef-57a7-4194-aa1c-5e02e92c21bb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/737e8d7a-80a3-4273-bb1d-a7d99fe7c7d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ef3f340-3e29-490c-b100-dca9837a7592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b6bfc3c-afd4-40ec-b998-69480fa6a24c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d4b23a6-461d-4fd5-88ca-4bebfd0c0d2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c621c929-9c14-4373-ab0a-e7baec1ac202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1369, 44, 3.214024835646457, 290.8312636961287, 84, 1989, 97.0, 745.0, 861.5, 1331.899999999999, 5.3691959540814125, 782.3090735342565, 3.919287532405392], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1274.448275862069, 1019, 1900, 1228.0, 1484.2, 1572.9999999999995, 1900.0, 0.2644308581693178, 318.20079306461685, 1.3002044637524564], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c621c929-9c14-4373-ab0a-e7baec1ac202", 3, 0, 0.0, 441.6666666666667, 253, 568, 504.0, 568.0, 568.0, 568.0, 0.04712461318546677, 0.030296585625422156, 0.030219885408648936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb9f1861-21b1-43e6-9f7d-5fb41b30a044", 3, 0, 0.0, 659.3333333333334, 217, 1325, 436.0, 1325.0, 1325.0, 1325.0, 0.05057230997454527, 0.03251312246084861, 0.03243081075841608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b6bfc3c-afd4-40ec-b998-69480fa6a24c", 3, 0, 0.0, 389.0, 264, 570, 333.0, 570.0, 570.0, 570.0, 0.03565274229009448, 0.029722224285459623, 0.02286324945035356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d8e7b8b-294e-4203-a1ec-ddefc090e991", 1, 0, 0.0, 1912.0, 1912, 1912, 1912.0, 1912.0, 1912.0, 1912.0, 0.5230125523012552, 0.0944895724372385, 0.36059263859832635], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 534.4999999999999, 88, 1218, 488.0, 1091.1000000000001, 1218.0, 1218.0, 0.09513239257967339, 0.020206343150467734, 0.06339578874002431], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 534.4999999999999, 88, 1218, 488.0, 1091.1000000000001, 1218.0, 1218.0, 0.09483467155592083, 0.020143106507239047, 0.06319738881951908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43771b32-c007-4b27-8ef5-d9aeb9011365", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 141.99999999999997, 85, 284, 87.5, 258.7, 280.24999999999994, 284.0, 0.14381904948682747, 0.06793866852977708, 0.08037472625351376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 126.0454545454545, 86, 260, 88.0, 258.7, 259.85, 260.0, 0.14381810931483743, 0.1068804503794837, 0.07218994940217427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 203.90909090909093, 84, 710, 90.0, 482.79999999999995, 679.6999999999996, 710.0, 0.14382092986768474, 5.800041205513572, 0.08300602495293134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=553ddd05-a777-4c10-9550-36c28d64b85e", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 209.4090909090909, 84, 766, 88.5, 705.0999999999999, 764.65, 766.0, 0.14381998967110982, 17.680225190643203, 0.08286503311128399], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 251.7777777777778, 85, 1325, 201.5, 422.30000000000143, 1325.0, 1325.0, 0.09504649357644114, 0.1278321709939223, 0.06142028998421172], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1b2e9608-74ba-4408-9306-8e10c05bad3a", 3, 0, 0.0, 646.3333333333333, 196, 1538, 205.0, 1538.0, 1538.0, 1538.0, 0.07520681875156682, 0.034029126974178994, 0.048228331035347204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 99.33333333333333, 86, 258, 88.0, 157.80000000000007, 258.0, 258.0, 0.10034183117152433, 0.07457044289211916, 0.050366895724769045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 121.86666666666666, 86, 267, 87.0, 262.2, 267.0, 267.0, 0.10034451617219119, 0.036897514800816135, 0.05666590711442619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 568.1111111111111, 426, 682, 597.0, 682.0, 682.0, 682.0, 0.0647892190739461, 19.050181612279715, 0.03695010150310988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 678.3333333333334, 579, 771, 675.0, 771.0, 771.0, 771.0, 0.0647132841991731, 58.229126876235846, 0.03684359832824016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 143.22222222222223, 84, 258, 88.0, 258.0, 258.0, 258.0, 0.06503078123645192, 0.11507399960981532, 0.036008254844793204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 87.64285714285714, 85, 90, 88.0, 89.5, 90.0, 90.0, 0.07423117709437964, 0.05516594313361612, 0.03726057131495228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 110.57142857142856, 84, 253, 87.0, 252.0, 253.0, 253.0, 0.07416747014759327, 0.01984559259808648, 0.042298635318549285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 122.92857142857143, 84, 258, 87.0, 257.0, 258.0, 258.0, 0.07416550562333458, 0.0199899214375394, 0.043601205454343185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 141.14285714285717, 85, 345, 87.0, 302.5, 345.0, 345.0, 0.07423196428382062, 0.020007834123373522, 0.04371276803041389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 123.66666666666667, 85, 256, 86.0, 256.0, 256.0, 256.0, 0.06495006062005658, 0.04826855091002251, 0.036470981305207546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 480.8000000000001, 84, 1901, 421.5, 851.9000000000002, 1848.9499999999994, 1901.0, 0.12850827593297007, 57.833304787093915, 0.07002697067441142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 143.66666666666663, 85, 593, 87.0, 396.8000000000001, 593.0, 593.0, 0.10034518744481015, 6.04462815627425, 0.058417100659602365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 375.45, 84, 1238, 337.0, 689.1, 1210.5999999999995, 1238.0, 0.12850497314246062, 18.909682488306046, 0.07015066404944871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 133.26666666666668, 85, 586, 87.0, 389.2000000000001, 586.0, 586.0, 0.10022986048003421, 1.9899412026580958, 0.05844784246872828], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 484.8333333333333, 87, 1912, 418.5, 1768.9000000000003, 1912.0, 1912.0, 0.09503796238608643, 0.020186285956029105, 0.06364222926060466], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 254.5, 174, 430, 181.0, 389.5, 430.0, 430.0, 0.07413055449654764, 0.11488788084572372, 0.16672135449760664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/278fef4b-d3b9-4cf1-95bd-552495c29b30", 3, 0, 0.0, 338.66666666666663, 185, 606, 225.0, 606.0, 606.0, 606.0, 0.03119703004273993, 0.03149153325603403, 0.020005907937564345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 478.12, 115, 1909, 457.0, 888.2000000000011, 1695.0999999999995, 1909.0, 0.11051433370908206, 0.06788429287403576, 0.04996888330791503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 97.95, 84, 295, 88.0, 92.7, 284.89999999999986, 295.0, 0.1285033218108688, 0.09549905068171012, 0.06450264395584626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 153.0, 86, 353, 88.0, 264.5, 348.5999999999999, 353.0, 0.12850745021942647, 0.13089186579966972, 0.06789309625850558], "isController": false}, {"data": ["login", 25, 0, 0.0, 2105.92, 1194, 3475, 2248.0, 2925.0, 3326.2, 3475.0, 0.10974490893367457, 47.412145599393774, 0.2310944846049842], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.86666666666669, 87, 99, 90.0, 94.2, 99.0, 99.0, 0.09324067282469511, 0.07548488063639867, 0.03314414541815334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c6b567a-d0ba-45ed-a3a0-1f741bf87331", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=737e8d7a-80a3-4273-bb1d-a7d99fe7c7d3", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76759fef-57a7-4194-aa1c-5e02e92c21bb", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 594.7999999999998, 174, 1989, 616.0, 942.8000000000002, 1937.0999999999992, 1989.0, 0.1284298804959962, 76.9229138773302, 0.27241181683330445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/553ddd05-a777-4c10-9550-36c28d64b85e", 3, 0, 0.0, 298.3333333333333, 198, 457, 240.0, 457.0, 457.0, 457.0, 0.02008731285320192, 0.027691982400166053, 0.012881512474221282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 380.8181818181818, 173, 853, 343.0, 830.1999999999999, 851.65, 853.0, 0.14373542228813724, 23.641140068944, 0.31824941689152547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 427.2105263157895, 85, 859, 93.0, 854.0, 859.0, 859.0, 0.125096291224166, 70.90855913762567, 0.17724117824246294], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 764.5384615384614, 182, 1478, 792.5, 1154.8, 1385.9499999999996, 1478.0, 0.10799853786594889, 0.033700865857508394, 0.04872590282623866], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 256.06666666666666, 173, 852, 178.0, 553.2000000000002, 852.0, 852.0, 0.10016895163175223, 8.134018857639886, 0.22357370890568756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 106.36363636363636, 88, 260, 89.0, 229.2000000000001, 260.0, 260.0, 0.08054713471874406, 0.06253415244277492, 0.02863198929455355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d4b23a6-461d-4fd5-88ca-4bebfd0c0d2c", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 279.7272727272727, 174, 687, 176.0, 638.6000000000001, 687.0, 687.0, 0.049703585887796414, 5.4757342716391335, 0.11062842700576561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b2e9608-74ba-4408-9306-8e10c05bad3a", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92a8da63-02df-426c-9a04-c2b00239294b", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 86.87500000000001, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.044522606353375925, 0.033087601010663166, 0.022348261392221902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 109.0, 85, 256, 87.0, 256.0, 256.0, 256.0, 0.04452334971421575, 0.011913474435249136, 0.025392222883888666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 118.0, 85, 341, 86.0, 341.0, 341.0, 341.0, 0.044523597506678544, 0.01200050089047195, 0.026175005565449688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ef3f340-3e29-490c-b100-dca9837a7592", 3, 0, 0.0, 327.6666666666667, 215, 512, 256.0, 512.0, 512.0, 512.0, 0.06911327666044646, 0.031271957863939, 0.04432068848342434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 87.625, 85, 95, 87.0, 95.0, 95.0, 95.0, 0.04452310192451108, 0.012000367315590878, 0.02621819380906268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 91.4, 87, 97, 90.0, 97.0, 97.0, 97.0, 0.07460236937125123, 0.022001870654411983, 0.04611650372265823], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 818.5344827586207, 670, 1533, 691.0, 1114.2, 1207.3999999999996, 1533.0, 0.2561803509670808, 306.4807624567696, 0.5058561227103882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 764.5384615384614, 182, 1478, 792.5, 1154.8, 1385.9499999999996, 1478.0, 0.10321883982024042, 0.03220936452924269, 0.04656943749702253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 98.93333333333332, 84, 257, 87.0, 166.40000000000006, 257.0, 257.0, 0.07656420674377533, 0.020636446348908197, 0.045086149088375514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 99.20000000000002, 85, 255, 87.0, 165.00000000000006, 255.0, 255.0, 0.07656459755095374, 0.0206365516836555, 0.04501160910710366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 148.72727272727275, 86, 594, 87.0, 528.0000000000002, 594.0, 594.0, 0.07468462718792011, 6.127514294043562, 0.04332291850549271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 133.0, 85, 592, 87.0, 491.4000000000004, 592.0, 592.0, 0.07468361305741134, 2.0146143312761393, 0.04339526344644506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 87.2, 85, 101, 86.0, 93.2, 101.0, 101.0, 0.07656537917727949, 0.020487220600170487, 0.043666192812042204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 104.45454545454545, 86, 259, 88.0, 226.40000000000012, 259.0, 259.0, 0.07468361305741134, 0.055502177281923845, 0.03748767296045842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 87.19999999999999, 86, 89, 87.0, 89.0, 89.0, 89.0, 0.07656342514138711, 0.05689918606698789, 0.038431250510422836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 159.9090909090909, 85, 263, 88.0, 262.8, 263.0, 263.0, 0.07468361305741134, 0.0301810907881158, 0.04202279292949867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 113.19999999999999, 86, 263, 90.0, 262.4, 263.0, 263.0, 0.07212162590993451, 0.05676760789395236, 0.025636984210172034], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 485.3888888888889, 85, 1538, 448.0, 1440.8000000000002, 1538.0, 1538.0, 0.09419004411233732, 0.019290766955516136, 0.06408622738784843], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/43771b32-c007-4b27-8ef5-d9aeb9011365", 3, 0, 0.0, 263.6666666666667, 184, 419, 188.0, 419.0, 419.0, 419.0, 0.059563991581622525, 0.038293907348211094, 0.03819696074732955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1102.1599999999999, 812, 1857, 1058.0, 1516.8000000000002, 1764.2999999999997, 1857.0, 0.10986306667369791, 0.05686272005572254, 0.05053271914385909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 187.99999999999997, 173, 346, 176.0, 254.80000000000007, 346.0, 346.0, 0.0765286599831637, 0.11860447597000076, 0.1721147499426035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d8e7b8b-294e-4203-a1ec-ddefc090e991", 3, 0, 0.0, 334.6666666666667, 243, 439, 322.0, 439.0, 439.0, 439.0, 0.04765611348509158, 0.0302039234881098, 0.03056072381693698], "isController": false}, {"data": ["addBook", 58, 15, 25.862068965517242, 872.5, 441, 2365, 724.0, 1406.3, 1467.3, 2365.0, 0.26606480971778784, 88.89235506635565, 0.9643057428712981], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/94c9e7a8-60bb-49c9-9673-89fafe209810", 1, 0, 0.0, 1244.0, 1244, 1244, 1244.0, 1244.0, 1244.0, 1244.0, 0.8038585209003215, 0.2567009143890675, 0.47964605104501606], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 155.41379310344828, 84, 727, 88.0, 350.2, 358.05, 727.0, 0.25685993162211473, 0.190889070277763, 0.12416568960248711], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 498.2758620689655, 413, 779, 432.5, 635.5, 689.2, 779.0, 0.2566167296410021, 75.45383899180597, 0.12906017164562114], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 131.6206896551724, 84, 352, 89.0, 263.3, 288.29999999999995, 352.0, 0.25699536965239156, 0.4547613377052086, 0.12498407625672951], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 659.5172413793105, 580, 985, 600.5, 773.4, 806.8, 985.0, 0.2566190004247487, 230.90622767027557, 0.12881070919757895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 89.72727272727272, 87, 92, 90.0, 92.0, 92.0, 92.0, 0.048108041915224886, 0.03594008990737015, 0.017100905524552595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 15, 8.620689655172415, 151.77586206896552, 86, 1096, 91.0, 262.5, 359.0, 1060.75, 0.7147346239633268, 1.6228065361762518, 0.3402867847005714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 110.25, 86, 260, 89.5, 260.0, 260.0, 260.0, 0.04437886234786371, 0.03436761507993743, 0.01577529872521718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb9f1861-21b1-43e6-9f7d-5fb41b30a044", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 106.9090909090909, 86, 341, 90.0, 174.99999999999991, 321.0499999999997, 341.0, 0.1477501678979181, 0.11990272414372061, 0.05252056749496306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 208.0, 173, 428, 176.0, 428.0, 428.0, 428.0, 0.04450081213982155, 0.06896756725185235, 0.1000833694902432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c9e5b73-f648-4447-8c46-0547fa4d03d7", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=278fef4b-d3b9-4cf1-95bd-552495c29b30", 1, 0, 0.0, 1753.0, 1753, 1753, 1753.0, 1753.0, 1753.0, 1753.0, 0.5704506560182544, 0.10305993297204792, 0.39329898745008557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 295.8181818181818, 174, 853, 184.0, 754.0000000000003, 853.0, 853.0, 0.07463851211518757, 8.222760017675757, 0.16612767553620986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c6b567a-d0ba-45ed-a3a0-1f741bf87331", 3, 0, 0.0, 288.3333333333333, 192, 449, 224.0, 449.0, 449.0, 449.0, 0.04698364968990791, 0.030205959680197958, 0.03012948889619746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76759fef-57a7-4194-aa1c-5e02e92c21bb", 3, 0, 0.0, 287.6666666666667, 185, 493, 185.0, 493.0, 493.0, 493.0, 0.02468059200513356, 0.024752898427023603, 0.01582707234704203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/737e8d7a-80a3-4273-bb1d-a7d99fe7c7d3", 3, 0, 0.0, 646.3333333333334, 211, 1281, 447.0, 1281.0, 1281.0, 1281.0, 0.06234284408054696, 0.028208513434882898, 0.03997897227821533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ef3f340-3e29-490c-b100-dca9837a7592", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 102.5, 87, 256, 90.0, 177.5, 256.0, 256.0, 0.07647932873000612, 0.0634091309489992, 0.02718601138449436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b6bfc3c-afd4-40ec-b998-69480fa6a24c", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 113.69999999999999, 88, 354, 90.0, 247.70000000000027, 349.3499999999999, 354.0, 0.12462767482147084, 0.09675683738580988, 0.04430124378419471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d4b23a6-461d-4fd5-88ca-4bebfd0c0d2c", 3, 0, 0.0, 636.0, 192, 1430, 286.0, 1430.0, 1430.0, 1430.0, 0.027024348938393495, 0.02710352183567394, 0.017330067515831764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c621c929-9c14-4373-ab0a-e7baec1ac202", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 88.63636363636364, 86, 96, 88.0, 95.2, 96.0, 96.0, 0.04976519874410735, 0.036983707269790715, 0.024979797025850757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 150.36363636363637, 86, 274, 87.0, 271.0, 274.0, 274.0, 0.049724256396347526, 0.020094532591989876, 0.027978723103697676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 149.27272727272725, 85, 599, 87.0, 530.0000000000002, 599.0, 599.0, 0.0497656490345464, 4.0830320414434755, 0.028867964381367742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 173.27272727272728, 86, 597, 87.0, 548.0000000000002, 597.0, 597.0, 0.04972582985629235, 1.3413701528617215, 0.028893426527826123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.454545454545453, 0.6574141709276844], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.363636363636363, 0.36523009495982467], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.363636363636363, 0.36523009495982467], "isController": false}, {"data": ["401/Unauthorized", 25, 56.81818181818182, 1.8261504747991235], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1369, 44, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
