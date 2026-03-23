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

    var data = {"OkPercent": 98.31158864159632, "KoPercent": 1.6884113584036837};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8009168303863785, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33a3d137-642a-46f5-8795-a6af5002bf41"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e248813-5f97-4642-bdf5-dc03641ca289"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d1b50bf-4a06-426e-90a0-95fce054658c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/061a530e-c876-445c-9a6c-ba0726f6b65b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74286717-2cf3-4348-bb72-9ef9da63c725"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8bccc6d-96e2-4624-a110-83865a9979f2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0da8d6a-bdfe-48aa-be6d-36cc9e406f0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=249b5bfa-2b98-4ad2-8bfc-5f2afad6a4dd"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32a72584-75df-4e10-89f3-763f1256c73f"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44678206-32ec-491a-923f-1e5113118335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d08c936d-a263-4537-a9a7-ae6a3a4b1930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6e79547-fc77-48db-a08e-124aa80a3c5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e618b419-d90e-48f5-9d7e-55c1fbe7e9ce"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/612a8d8a-cec2-4744-a03e-29779f7d3069"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4f9759-d97c-44b3-a292-a5ab9bd33156"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d1b50bf-4a06-426e-90a0-95fce054658c"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e618b419-d90e-48f5-9d7e-55c1fbe7e9ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a87b3698-92af-495e-ab8f-d179c940fdee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=061a530e-c876-445c-9a6c-ba0726f6b65b"], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8bccc6d-96e2-4624-a110-83865a9979f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74286717-2cf3-4348-bb72-9ef9da63c725"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32a72584-75df-4e10-89f3-763f1256c73f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0da8d6a-bdfe-48aa-be6d-36cc9e406f0e"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6e79547-fc77-48db-a08e-124aa80a3c5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe4f9759-d97c-44b3-a292-a5ab9bd33156"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44678206-32ec-491a-923f-1e5113118335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0778a9b7-1ba3-4b29-922b-705477a2c2ec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33a3d137-642a-46f5-8795-a6af5002bf41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/249b5bfa-2b98-4ad2-8bfc-5f2afad6a4dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 22, 1.6884113584036837, 325.71603990790453, 99, 2234, 128.0, 813.0, 999.7999999999995, 1359.0400000000009, 5.058465456465363, 727.7993649257729, 3.6848754115098528], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33a3d137-642a-46f5-8795-a6af5002bf41", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1499.2857142857142, 1225, 2036, 1444.0, 1752.0, 1876.1999999999998, 2036.0, 0.24362337566289485, 293.1618465061254, 1.1978942348268315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e248813-5f97-4642-bdf5-dc03641ca289", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 382.68749999999994, 106, 624, 422.5, 534.4000000000001, 624.0, 624.0, 0.08448577206794769, 0.0170735102122177, 0.05666590266447004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 382.68749999999994, 106, 624, 422.5, 534.4000000000001, 624.0, 624.0, 0.08575364051001978, 0.017329730452189666, 0.05751628146756637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 131.92857142857142, 101, 307, 104.0, 304.5, 307.0, 307.0, 0.09076998884825851, 0.024288063422287925, 0.05176725926502244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 135.07142857142856, 101, 342, 103.0, 327.5, 342.0, 342.0, 0.09088548428979486, 0.06754282572708388, 0.045620252856400936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d1b50bf-4a06-426e-90a0-95fce054658c", 3, 0, 0.0, 258.0, 192, 355, 227.0, 355.0, 355.0, 355.0, 0.0504142369805233, 0.03136120015292319, 0.03232944233451527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 146.42857142857144, 101, 308, 103.5, 307.0, 308.0, 308.0, 0.09088843444671665, 0.024497273346966598, 0.053521216768916156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 160.5, 100, 308, 103.5, 307.0, 308.0, 308.0, 0.09076998884825851, 0.02446534855675718, 0.05336282547524573], "isController": false}, {"data": ["goToProfile", 18, 3, 16.666666666666668, 246.66666666666669, 104, 882, 200.0, 443.70000000000067, 882.0, 882.0, 0.0919986711303059, 0.1609777094886407, 0.0594607296644604], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 127.05555555555556, 101, 320, 103.0, 309.20000000000005, 320.0, 320.0, 0.11581446522670683, 0.08606914847414443, 0.05813343274074932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 628.8, 500, 718, 711.0, 718.0, 718.0, 718.0, 0.02646678947256982, 7.7821148850547335, 0.015094340871074976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 181.3888888888889, 101, 306, 105.5, 306.0, 306.0, 306.0, 0.11581595557814682, 0.05998150563959361, 0.06443016539161878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 869.2, 700, 916, 912.0, 916.0, 916.0, 916.0, 0.026408915649923415, 23.762788723723126, 0.015035544749907568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 184.6, 101, 313, 104.0, 313.0, 313.0, 313.0, 0.026493294547150117, 0.046880712616636726, 0.01466962696116613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 116.88888888888891, 102, 305, 105.0, 134.90000000000026, 305.0, 305.0, 0.08434350297310848, 0.06268106031497613, 0.04233648489079859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 158.94444444444446, 99, 308, 103.0, 306.2, 308.0, 308.0, 0.0842649289365766, 0.02254745168810741, 0.04805734228414134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 125.2777777777778, 100, 308, 103.0, 306.2, 308.0, 308.0, 0.08434587431527552, 0.0227338489365391, 0.04958614876737876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 113.72222222222221, 101, 305, 103.0, 125.90000000000029, 305.0, 305.0, 0.0842649289365766, 0.022712031627436662, 0.049620851707769226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/061a530e-c876-445c-9a6c-ba0726f6b65b", 3, 0, 0.0, 339.0, 204, 430, 383.0, 430.0, 430.0, 430.0, 0.08765010079761591, 0.039659388056212934, 0.05620790969117948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 104.4, 102, 106, 105.0, 106.0, 106.0, 106.0, 0.02652266627059485, 0.019710692413986992, 0.014893098735929726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 236.16666666666669, 101, 902, 103.5, 722.9000000000003, 902.0, 902.0, 0.1158174459679443, 17.39480392870471, 0.06642914706885347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 517.4117647058823, 102, 915, 699.0, 911.8, 915.0, 915.0, 0.08308123879014168, 39.587585074272184, 0.04506279047889004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 226.16666666666663, 100, 704, 103.5, 526.7000000000003, 704.0, 704.0, 0.11581670076825078, 5.701672767150523, 0.066541821893217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 398.1176470588235, 101, 710, 499.0, 707.6, 710.0, 710.0, 0.0831649650462544, 12.956392588167093, 0.04518941890926702], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 347.4666666666666, 104, 843, 374.0, 695.4000000000001, 843.0, 843.0, 0.09011282125220776, 0.018339367137656347, 0.060843754505641064], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74286717-2cf3-4348-bb72-9ef9da63c725", 3, 0, 0.0, 333.0, 179, 515, 305.0, 515.0, 515.0, 515.0, 0.01834851162989829, 0.025294904541868245, 0.011766460908495972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8bccc6d-96e2-4624-a110-83865a9979f2", 3, 0, 0.0, 272.0, 197, 384, 235.0, 384.0, 384.0, 384.0, 0.021951487213258698, 0.026331780722935648, 0.014076962828814986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 277.5, 206, 612, 211.0, 441.0000000000003, 612.0, 612.0, 0.08422274107589872, 0.13052879891352664, 0.1894189186501902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0da8d6a-bdfe-48aa-be6d-36cc9e406f0e", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=249b5bfa-2b98-4ad2-8bfc-5f2afad6a4dd", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 534.4545454545455, 122, 2024, 377.5, 1117.8999999999999, 1897.849999999998, 2024.0, 0.10533674241336054, 0.0647039169707068, 0.04762784349354094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 117.47058823529412, 102, 336, 104.0, 154.39999999999984, 336.0, 336.0, 0.08316252403152348, 0.06180339920702087, 0.04174368882051081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 210.58823529411765, 100, 310, 303.0, 308.4, 310.0, 310.0, 0.08316455820051463, 0.08838145259130979, 0.04373209821734324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32a72584-75df-4e10-89f3-763f1256c73f", 3, 0, 0.0, 254.0, 177, 383, 202.0, 383.0, 383.0, 383.0, 0.019360209606536005, 0.02288311233116284, 0.012415238582316385], "isController": false}, {"data": ["login", 22, 0, 0.0, 2111.1363636363635, 1437, 3203, 1991.0, 2993.0, 3186.7999999999997, 3203.0, 0.10022596399154457, 27.389329501113878, 0.18899143068007873], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/44678206-32ec-491a-923f-1e5113118335", 3, 0, 0.0, 459.0, 179, 756, 442.0, 756.0, 756.0, 756.0, 0.02971385557085269, 0.02477121878807088, 0.019054783683131446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 109.11111111111111, 103, 128, 106.0, 121.70000000000002, 128.0, 128.0, 0.11731199124070466, 0.09497230540873453, 0.04170074688634423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d08c936d-a263-4537-a9a7-ae6a3a4b1930", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6e79547-fc77-48db-a08e-124aa80a3c5c", 3, 0, 0.0, 294.6666666666667, 264, 355, 265.0, 355.0, 355.0, 355.0, 0.03248370400848907, 0.02708032746280616, 0.020831021125235508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e618b419-d90e-48f5-9d7e-55c1fbe7e9ce", 3, 0, 0.0, 336.3333333333333, 195, 414, 400.0, 414.0, 414.0, 414.0, 0.033975854492740494, 0.028324271925751432, 0.021787901481347256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 636.2941176470588, 206, 1020, 809.0, 1019.2, 1020.0, 1020.0, 0.0830374107958403, 52.65317883693895, 0.17550525364265582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/612a8d8a-cec2-4744-a03e-29779f7d3069", 2, 0, 0.0, 332.0, 277, 387, 332.0, 387.0, 387.0, 387.0, 0.08685079034219212, 0.051016357803543515, 0.05398489067656766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 501.27272727272725, 101, 1023, 109.0, 1022.2, 1023.0, 1023.0, 0.057945057549977606, 31.518654357731712, 0.08033292069428714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 312.2857142857143, 206, 644, 210.0, 632.0, 644.0, 644.0, 0.0907076492464786, 0.14057913999429836, 0.20400362911585956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4f9759-d97c-44b3-a292-a5ab9bd33156", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["register", 25, 6, 24.0, 944.5199999999999, 133, 1721, 948.0, 1607.4000000000003, 1715.9, 1721.0, 0.10344042865713636, 0.03266454786188634, 0.04666941214804394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 111.3529411764706, 104, 154, 106.0, 130.79999999999998, 154.0, 154.0, 0.08028941974364061, 0.06233407099237723, 0.028540379674497244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 432.49999999999994, 206, 1004, 409.0, 826.7000000000003, 1004.0, 1004.0, 0.11573776394640056, 23.226576213719426, 0.2553615117280934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 490.38461538461536, 206, 1111, 408.0, 1073.3999999999999, 1111.0, 1111.0, 0.10366412822455245, 38.27071382470795, 0.22498199583349945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 105.0, 103, 111, 104.0, 110.4, 111.0, 111.0, 0.05613562366677893, 0.04171797813517458, 0.028177451723363646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 121.63636363636364, 102, 308, 103.0, 267.20000000000016, 308.0, 308.0, 0.05607781561614226, 0.022662128611921125, 0.031553728282591405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 157.9090909090909, 102, 709, 103.0, 588.2000000000005, 709.0, 709.0, 0.055963410104956826, 4.591528514947318, 0.032463150002289415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d1b50bf-4a06-426e-90a0-95fce054658c", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 157.54545454545456, 101, 710, 102.0, 588.8000000000004, 710.0, 710.0, 0.05596312538792621, 1.5096231932813724, 0.03251763633380478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 107.33333333333333, 104, 113, 105.0, 113.0, 113.0, 113.0, 0.019826976584340655, 0.005847409109834841, 0.012256324392468392], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 964.0892857142861, 802, 1592, 817.0, 1330.0, 1446.0, 1592.0, 0.24802246374885956, 296.7210932032987, 0.4897474821290957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 944.5199999999999, 133, 1721, 948.0, 1607.4000000000003, 1715.9, 1721.0, 0.10214421128325815, 0.03225522671929136, 0.04608459532506374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e618b419-d90e-48f5-9d7e-55c1fbe7e9ce", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 103.0, 101, 104, 104.0, 104.0, 104.0, 104.0, 0.029215675963094757, 0.007874537661927885, 0.017204152935298964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 144.4, 101, 309, 104.0, 309.0, 309.0, 309.0, 0.02918038144594626, 0.007865024686602703, 0.01715487268599575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 161.64705882352942, 99, 311, 102.0, 307.0, 311.0, 311.0, 0.07839628862746545, 0.021130249669121547, 0.04608844311888105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 151.41176470588232, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.07839628862746545, 0.021130249669121547, 0.04616500199449381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 127.58823529411762, 101, 312, 104.0, 304.8, 312.0, 312.0, 0.07839484254165302, 0.05826022966230269, 0.03935053619766568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 144.4, 102, 308, 104.0, 308.0, 308.0, 308.0, 0.02918055174587241, 0.007808077322626016, 0.01664203341756786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 139.70588235294122, 100, 305, 102.0, 304.2, 305.0, 305.0, 0.07839665015725446, 0.0209772286553591, 0.04471058954280918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 147.6, 103, 314, 105.0, 314.0, 314.0, 314.0, 0.029215505252947846, 0.02171191357177081, 0.014664814160171086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a87b3698-92af-495e-ab8f-d179c940fdee", 2, 0, 0.0, 197.0, 195, 199, 197.0, 199.0, 199.0, 199.0, 0.013687005556924255, 0.027053221921108102, 0.008507596715803017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 106.8, 103, 111, 106.0, 111.0, 111.0, 111.0, 0.028794379337153387, 0.022664325923579715, 0.010235502030003743], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 361.8666666666667, 101, 515, 414.0, 492.2, 515.0, 515.0, 0.09124920156948627, 0.018071619217081853, 0.06209223013048636], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1086.2727272727277, 715, 1377, 1131.5, 1362.4, 1374.8999999999999, 1377.0, 0.10425947339487802, 0.053962422753208346, 0.0479552851259644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 293.4, 207, 624, 211.0, 624.0, 624.0, 624.0, 0.02916268110024963, 0.04519645986923454, 0.0655875532947997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=061a530e-c876-445c-9a6c-ba0726f6b65b", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["addBook", 57, 4, 7.017543859649122, 1081.4736842105258, 532, 3273, 897.0, 1637.6000000000004, 1997.5999999999992, 3273.0, 0.2688412940227619, 96.9748657341136, 0.9750056819253754], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 183.85714285714286, 102, 541, 105.0, 413.0, 416.0, 541.0, 0.24879379437192894, 0.18489460695023235, 0.12026653145908674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8bccc6d-96e2-4624-a110-83865a9979f2", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74286717-2cf3-4348-bb72-9ef9da63c725", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 584.4464285714286, 499, 835, 512.0, 752.6000000000004, 820.45, 835.0, 0.24874958911898226, 73.140638464682, 0.12510355312136315], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 162.71428571428572, 101, 321, 108.0, 308.0, 310.3, 321.0, 0.2491923497948613, 0.44095365022293814, 0.12118924824007903], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 774.5892857142859, 697, 1034, 709.0, 918.2, 1020.65, 1034.0, 0.24853210724160427, 223.62962696884028, 0.12475146789275839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 121.61538461538463, 103, 305, 105.0, 228.59999999999994, 305.0, 305.0, 0.10484885634093621, 0.07832946787189082, 0.03727049190244217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 4, 2.3529411764705883, 197.0117647058823, 102, 2234, 109.0, 338.3000000000002, 505.89999999999907, 1330.8799999999899, 0.7018876649436012, 1.5531925695900977, 0.3366464194439398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 143.27272727272725, 103, 312, 105.0, 311.0, 312.0, 312.0, 0.0564594774931992, 0.043723013332135706, 0.02006957989016065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 122.07142857142857, 103, 308, 107.0, 213.5, 308.0, 308.0, 0.08838328040858327, 0.07172510353469991, 0.03141749420773859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32a72584-75df-4e10-89f3-763f1256c73f", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0da8d6a-bdfe-48aa-be6d-36cc9e406f0e", 3, 0, 0.0, 572.6666666666666, 215, 1030, 473.0, 1030.0, 1030.0, 1030.0, 0.016515367549504816, 0.022767767438851852, 0.010590909528816564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 264.0, 206, 813, 208.0, 693.4000000000004, 813.0, 813.0, 0.055932961802871904, 6.162010856715007, 0.12449354450992557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 327.88235294117646, 204, 616, 239.0, 608.8, 616.0, 616.0, 0.07835726302689498, 0.12143845353875227, 0.176227321045839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6e79547-fc77-48db-a08e-124aa80a3c5c", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 152.2222222222222, 103, 316, 106.0, 312.4, 316.0, 316.0, 0.0845050585667003, 0.07006327609680524, 0.030038907537381754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4f9759-d97c-44b3-a292-a5ab9bd33156", 3, 0, 0.0, 372.0, 283, 438, 395.0, 438.0, 438.0, 438.0, 0.08254230293025175, 0.03734824253680011, 0.05293240129316275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44678206-32ec-491a-923f-1e5113118335", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 0.21431086892052195, 0.8178566132858838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0778a9b7-1ba3-4b29-922b-705477a2c2ec", 2, 0, 0.0, 193.5, 186, 201, 193.5, 201.0, 201.0, 201.0, 0.02836718484057642, 0.03227321322194485, 0.017632532374049697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33a3d137-642a-46f5-8795-a6af5002bf41", 3, 0, 0.0, 556.3333333333334, 332, 882, 455.0, 882.0, 882.0, 882.0, 0.08208158909956496, 0.03713978152617035, 0.05263695655147884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 108.05882352941177, 104, 119, 106.0, 117.4, 119.0, 119.0, 0.08219707958611353, 0.06381511549898462, 0.029218493134126295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/249b5bfa-2b98-4ad2-8bfc-5f2afad6a4dd", 3, 0, 0.0, 356.0, 265, 477, 326.0, 477.0, 477.0, 477.0, 0.08352590695213964, 0.03871773811843973, 0.05356316298688643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 105.76923076923075, 102, 133, 104.0, 121.79999999999998, 133.0, 133.0, 0.10442605831793718, 0.07760569373042012, 0.05241698630412082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 213.6153846153846, 102, 310, 303.0, 308.8, 310.0, 310.0, 0.10425856123185501, 0.07607930166813698, 0.05676577913224798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 366.38461538461536, 101, 1008, 106.0, 970.4, 1008.0, 1008.0, 0.10375182563308566, 28.74430611976153, 0.05825128791929704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 256.6153846153846, 101, 702, 105.0, 623.5999999999999, 702.0, 702.0, 0.1040966016463278, 9.437226496188464, 0.058546518669325136], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4604758250191865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.636363636363637, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 13.636363636363637, 0.23023791250959325], "isController": false}, {"data": ["401/Unauthorized", 10, 45.45454545454545, 0.7674597083653109], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 22, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
