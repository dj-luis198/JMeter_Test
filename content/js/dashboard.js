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

    var data = {"OkPercent": 99.05660377358491, "KoPercent": 0.9433962264150944};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8010012515644556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/802b39a3-5e56-40bd-b219-8fbb4a2b735d"], "isController": false}, {"data": [0.3629032258064516, 500, 1500, "see books"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92ef3aae-bc5d-4049-8018-8f939036758a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67734517-5eb1-487e-8c10-41bcdc586e0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b67d46ab-63d2-43f7-9886-5dce859f15c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb56245d-5604-4d3f-9537-e3d75bcd2b17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c3dc896-33e8-4411-ab53-39a984b8a795"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9642becf-bd91-4250-8244-3d4251e5443c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ca60a0c-7e46-4b5c-8e9f-4a6e5f98ca83"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eaedce7d-87a7-4050-8694-dd7feed480e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c3dc896-33e8-4411-ab53-39a984b8a795"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b67d46ab-63d2-43f7-9886-5dce859f15c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3bee4c4-52e2-466d-9322-029927418d64"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c1febaa-e3b2-440f-932a-1d53e4617db3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67734517-5eb1-487e-8c10-41bcdc586e0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92ef3aae-bc5d-4049-8018-8f939036758a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0238f0a-deeb-45db-9aea-536e441b0fad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7455dff-514f-4581-89cd-dc63cdbccdd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.47580645161290325, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=802b39a3-5e56-40bd-b219-8fbb4a2b735d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb56245d-5604-4d3f-9537-e3d75bcd2b17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [0.9919354838709677, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6854838709677419, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eee244b0-7525-4b82-a7e5-043b13a833b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf6c3dc9-6acb-437e-aa1b-bfb6eed1c7a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9505494505494505, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eee244b0-7525-4b82-a7e5-043b13a833b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c80b51d4-de5d-4b9d-b022-8cf661cf7227"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3bee4c4-52e2-466d-9322-029927418d64"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf6c3dc9-6acb-437e-aa1b-bfb6eed1c7a8"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ca60a0c-7e46-4b5c-8e9f-4a6e5f98ca83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7455dff-514f-4581-89cd-dc63cdbccdd6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaedce7d-87a7-4050-8694-dd7feed480e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c1febaa-e3b2-440f-932a-1d53e4617db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1378, 13, 0.9433962264150944, 337.81059506531244, 83, 3341, 102.0, 913.5000000000007, 1111.1, 1910.5000000000018, 5.4636575579274576, 771.9956442583522, 4.002511558976179], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/802b39a3-5e56-40bd-b219-8fbb4a2b735d", 3, 0, 0.0, 256.3333333333333, 185, 398, 186.0, 398.0, 398.0, 398.0, 0.029086114289038414, 0.029171327514494583, 0.018652228238738827], "isController": false}, {"data": ["see books", 62, 0, 0.0, 1417.7096774193546, 1026, 2201, 1375.0, 1748.3000000000002, 1957.8999999999992, 2201.0, 0.2694773443442356, 324.27076683554276, 1.3250179968488538], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 733.0, 88, 1518, 618.5, 1434.5, 1518.0, 1518.0, 0.07772337141778532, 0.014676141631413566, 0.05256194795587533], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 733.0, 88, 1518, 618.5, 1434.5, 1518.0, 1518.0, 0.07580885339109246, 0.014314632124001624, 0.05126721774739407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92ef3aae-bc5d-4049-8018-8f939036758a", 3, 0, 0.0, 523.3333333333334, 220, 826, 524.0, 826.0, 826.0, 826.0, 0.03019718763525824, 0.03028565595840841, 0.019364732956204014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67734517-5eb1-487e-8c10-41bcdc586e0c", 3, 0, 0.0, 766.6666666666666, 283, 1042, 975.0, 1042.0, 1042.0, 1042.0, 0.019577006153705598, 0.026988483418275786, 0.012554265013932302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 137.2941176470588, 84, 265, 87.0, 259.4, 265.0, 265.0, 0.08694362473085834, 0.03862718254069729, 0.04872598821658168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b67d46ab-63d2-43f7-9886-5dce859f15c7", 3, 0, 0.0, 359.66666666666663, 177, 716, 186.0, 716.0, 716.0, 716.0, 0.034111841357196464, 0.027726975217747255, 0.021875106599504243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 98.41176470588235, 85, 255, 88.0, 131.7999999999999, 255.0, 255.0, 0.08694229077593438, 0.06461238601609966, 0.043640954549638934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 190.6470588235294, 84, 674, 88.0, 668.4, 674.0, 674.0, 0.08694318007466885, 3.028227765560272, 0.05031896480079783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 203.58823529411765, 83, 913, 86.0, 784.9999999999999, 913.0, 913.0, 0.08694362473085834, 9.224444887331291, 0.05023431626510646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb56245d-5604-4d3f-9537-e3d75bcd2b17", 3, 0, 0.0, 522.3333333333334, 359, 778, 430.0, 778.0, 778.0, 778.0, 0.053071044438154545, 0.03363584750035381, 0.03403318930441551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c3dc896-33e8-4411-ab53-39a984b8a795", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 331.9285714285714, 86, 1024, 224.5, 925.0, 1024.0, 1024.0, 0.07748505645339827, 0.1733576800143901, 0.050087473364511845], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 106.66666666666666, 85, 264, 88.0, 253.20000000000002, 264.0, 264.0, 0.08564332410288618, 0.06364704066630505, 0.04298893416883154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 114.66666666666667, 83, 260, 86.5, 258.2, 260.0, 260.0, 0.0856449540847885, 0.030063088809059335, 0.04844478576866346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 594.25, 496, 697, 592.0, 697.0, 697.0, 697.0, 0.11524720525527257, 33.88650491241213, 0.06572692174714763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9642becf-bd91-4250-8244-3d4251e5443c", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 972.5, 925, 1007, 979.0, 1007.0, 1007.0, 1007.0, 0.11359118532401885, 102.20954822655763, 0.06467154398818652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 171.0, 83, 259, 171.0, 259.0, 259.0, 259.0, 0.11606313834726091, 0.20537735027855153, 0.06426542914345404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 89.18181818181819, 83, 100, 87.0, 99.2, 100.0, 100.0, 0.05646991180426501, 0.041966409065474296, 0.028345248698625213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 86.54545454545455, 85, 89, 86.0, 88.8, 89.0, 89.0, 0.0564731008352885, 0.015110966434442432, 0.032207315320125475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 116.81818181818183, 84, 257, 86.0, 256.2, 257.0, 257.0, 0.0564731008352885, 0.015221265459511355, 0.03320000654574578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 101.45454545454545, 84, 252, 86.0, 220.2000000000001, 252.0, 252.0, 0.05647281090849351, 0.015221187315179891, 0.0332549853299039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 128.0, 85, 254, 86.5, 254.0, 254.0, 254.0, 0.11663507799970842, 0.08667899839626768, 0.06549332993147688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 663.2, 86, 1111, 908.0, 1098.4, 1111.0, 1111.0, 0.06979568476546323, 41.874457265847106, 0.03703351763271649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 159.66666666666663, 84, 1066, 87.0, 333.40000000000117, 1066.0, 1066.0, 0.0856445465834963, 4.303085530651232, 0.04994073278425663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 470.53333333333325, 85, 766, 659.0, 752.8, 766.0, 766.0, 0.06979665906658601, 13.687960948769252, 0.03710219539574706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 158.44444444444446, 85, 498, 88.0, 287.4000000000003, 498.0, 498.0, 0.0856437315925452, 1.4208068323476375, 0.050023894006366185], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 526.0, 88, 921, 495.5, 856.5, 921.0, 921.0, 0.07581254805974029, 0.014315329771046105, 0.05188315492564955], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 222.63636363636365, 172, 343, 180.0, 342.6, 343.0, 343.0, 0.05644470215156942, 0.08747826397904362, 0.1269454580615863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ca60a0c-7e46-4b5c-8e9f-4a6e5f98ca83", 3, 0, 0.0, 604.6666666666666, 255, 1024, 535.0, 1024.0, 1024.0, 1024.0, 0.020448225094061835, 0.02416910980356072, 0.013112956847428978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1009.95, 297, 3011, 779.5, 1677.4, 2944.599999999999, 3011.0, 0.09279407602618649, 0.056999486152804, 0.04195669648449643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 88.06666666666668, 84, 95, 88.0, 93.8, 95.0, 95.0, 0.0697943857396111, 0.051868679245941456, 0.03503351002945323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 145.33333333333331, 86, 257, 89.0, 257.0, 257.0, 257.0, 0.06979633429652275, 0.08856318720307477, 0.035897854228029276], "isController": false}, {"data": ["login", 20, 0, 0.0, 3458.4500000000003, 2436, 4829, 3251.0, 4658.200000000001, 4822.7, 4829.0, 0.09203272683766348, 22.148304843452333, 0.16937976269361385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eaedce7d-87a7-4050-8694-dd7feed480e8", 3, 0, 0.0, 450.3333333333333, 220, 720, 411.0, 720.0, 720.0, 720.0, 0.021000021000020998, 0.024821313883813884, 0.013466810341810341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 92.0, 88, 102, 91.0, 97.5, 102.0, 102.0, 0.08912082308031272, 0.07214957259138598, 0.031679667579329905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c3dc896-33e8-4411-ab53-39a984b8a795", 3, 0, 0.0, 347.0, 222, 419, 400.0, 419.0, 419.0, 419.0, 0.07599169157505446, 0.03438426148741071, 0.048731651172805104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b67d46ab-63d2-43f7-9886-5dce859f15c7", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3bee4c4-52e2-466d-9322-029927418d64", 3, 0, 0.0, 336.0, 219, 562, 227.0, 562.0, 562.0, 562.0, 0.04087750374710451, 0.026280296191579233, 0.026213763796157516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c1febaa-e3b2-440f-932a-1d53e4617db3", 3, 0, 0.0, 670.6666666666666, 354, 1025, 633.0, 1025.0, 1025.0, 1025.0, 0.0172416765806307, 0.023769043072581708, 0.011056674109323723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 752.7333333333332, 175, 1200, 995.0, 1191.6, 1200.0, 1200.0, 0.06976549491642094, 55.678565183936726, 0.14500412924523037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 359.2941176470588, 171, 1002, 345.0, 872.3999999999999, 1002.0, 1002.0, 0.08690362388111585, 12.350244009081429, 0.1928323919839075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 762.6666666666666, 86, 1261, 1028.0, 1261.0, 1261.0, 1261.0, 0.15137371647702905, 120.7438953818402, 0.2609866176173777], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1270.6086956521738, 284, 2362, 1173.0, 2101.8, 2330.1999999999994, 2362.0, 0.09167656507840338, 0.029022608238135857, 0.04136188775998278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67734517-5eb1-487e-8c10-41bcdc586e0c", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92ef3aae-bc5d-4049-8018-8f939036758a", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0238f0a-deeb-45db-9aea-536e441b0fad", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 91.57142857142856, 86, 98, 91.5, 97.5, 98.0, 98.0, 0.07041120141627102, 0.054664946412046354, 0.02502898175344009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 307.55555555555554, 173, 1157, 179.0, 590.9000000000009, 1157.0, 1157.0, 0.08560748019138029, 5.815098952437911, 0.19131636957700393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 318.76190476190476, 175, 524, 343.0, 516.4, 523.3, 524.0, 0.11831319192089917, 0.18336233943209668, 0.26608914159553787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 99.73333333333333, 84, 258, 89.0, 159.60000000000005, 258.0, 258.0, 0.09112945850875755, 0.06772413859879345, 0.04574271647802869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7455dff-514f-4581-89cd-dc63cdbccdd6", 3, 0, 0.0, 938.3333333333334, 190, 2136, 489.0, 2136.0, 2136.0, 2136.0, 0.03624895784246203, 0.02330458715457764, 0.023245588199755925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 108.93333333333334, 83, 256, 87.0, 253.6, 256.0, 256.0, 0.09122367436797198, 0.0244094597429925, 0.052026001787984014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 141.9333333333333, 84, 257, 88.0, 254.0, 257.0, 257.0, 0.09122422915526363, 0.02458778051450465, 0.05362986909323116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 120.53333333333335, 84, 260, 87.0, 258.2, 260.0, 260.0, 0.09122533875009123, 0.024588079584985528, 0.053719608658500985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 3.3513849431818183, 7.0245916193181825], "isController": false}, {"data": ["https://demoqa.com/books", 62, 0, 0.0, 958.5161290322578, 665, 1793, 879.5, 1382.8000000000002, 1572.2499999999993, 1793.0, 0.25781984214772247, 308.44216388817273, 0.5090934773659128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1270.6086956521738, 284, 2362, 1173.0, 2101.8, 2330.1999999999994, 2362.0, 0.09362000048845218, 0.029637853415501843, 0.042238711157875884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 101.18181818181817, 83, 256, 86.0, 222.40000000000012, 256.0, 256.0, 0.06248189445103975, 0.01684082311375681, 0.03679353745505564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 117.81818181818181, 84, 257, 87.0, 256.4, 257.0, 257.0, 0.06242161830882812, 0.016824576809801327, 0.03669708420108841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=802b39a3-5e56-40bd-b219-8fbb4a2b735d", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 231.2857142857143, 84, 1098, 87.5, 1013.0, 1098.0, 1098.0, 0.06913477825019876, 8.902771270672535, 0.03979493513676341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 183.07142857142856, 83, 506, 88.5, 504.0, 506.0, 506.0, 0.06913443685063012, 2.9199461800754554, 0.03986225272093391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 94.85714285714288, 85, 162, 87.0, 135.0, 162.0, 162.0, 0.06913477825019876, 0.051378482664454356, 0.034702417988869305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 102.27272727272728, 84, 261, 86.0, 226.60000000000014, 261.0, 261.0, 0.06241949304022652, 0.016702090911154363, 0.03559861712450419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 135.85714285714286, 84, 261, 88.5, 260.5, 261.0, 261.0, 0.06913375406160806, 0.03333234570827531, 0.03859839338093686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 87.9090909090909, 85, 91, 88.0, 91.0, 91.0, 91.0, 0.06248082974541902, 0.04643350726197644, 0.03136244774330603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb56245d-5604-4d3f-9537-e3d75bcd2b17", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 92.18181818181817, 86, 99, 92.0, 98.2, 99.0, 99.0, 0.061621197692006045, 0.04850262240210633, 0.021904410117080275], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 570.7692307692307, 86, 975, 535.0, 942.6, 975.0, 975.0, 0.07352566894219185, 0.013775016401879996, 0.0500407572578319], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1817.2500000000002, 1080, 3341, 1784.5, 2594.7000000000003, 3304.4499999999994, 3341.0, 0.09134755919321837, 0.04727949841055247, 0.04201630896484946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 207.45454545454547, 172, 350, 177.0, 348.8, 350.0, 350.0, 0.06238798520837587, 0.09668919191962158, 0.14031204095204064], "isController": false}, {"data": ["addBook", 60, 4, 6.666666666666667, 1058.316666666666, 455, 3594, 764.5, 1785.3999999999999, 2592.949999999997, 3594.0, 0.296491028675624, 89.78991931274615, 1.079760101696423], "isController": true}, {"data": ["https://demoqa.com/books-0", 62, 0, 0.0, 149.0, 84, 629, 89.0, 349.0, 350.7, 629.0, 0.2588629237314673, 0.19237762203090492, 0.12513393285847296], "isController": false}, {"data": ["https://demoqa.com/books-3", 62, 0, 0.0, 523.6451612903224, 418, 774, 505.5, 690.9, 749.5999999999998, 774.0, 0.2590413797713751, 76.166766636097, 0.1302796001779865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eee244b0-7525-4b82-a7e5-043b13a833b5", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf6c3dc9-6acb-437e-aa1b-bfb6eed1c7a8", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/books-1", 62, 0, 0.0, 137.25806451612902, 84, 311, 90.0, 263.7, 274.49999999999994, 311.0, 0.2593035608234143, 0.4588457541133073, 0.12610661454107452], "isController": false}, {"data": ["https://demoqa.com/books-2", 62, 0, 0.0, 807.7096774193549, 576, 1345, 776.5, 1020.9000000000001, 1127.75, 1345.0, 0.2585326188937306, 232.62810493244794, 0.12977125596814212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 99.71428571428571, 87, 252, 92.0, 101.4, 236.99999999999977, 252.0, 0.11977823914581004, 0.08948276654936003, 0.04257742094636216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, 2.197802197802198, 201.21428571428586, 86, 2888, 97.0, 345.5000000000001, 451.3499999999999, 2326.9199999999914, 0.7692632824717865, 1.6761013911196585, 0.36783207500317006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 103.33333333333333, 89, 260, 91.0, 162.20000000000005, 260.0, 260.0, 0.09502271042779224, 0.0735869232121477, 0.033777604097379274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eee244b0-7525-4b82-a7e5-043b13a833b5", 2, 0, 0.0, 215.0, 193, 237, 215.0, 237.0, 237.0, 237.0, 0.026460976674649063, 0.03046630029239379, 0.016447667630287235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c80b51d4-de5d-4b9d-b022-8cf661cf7227", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.6584246134020618, 1.2302673969072164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 94.35294117647061, 86, 128, 91.0, 117.6, 128.0, 128.0, 0.0889987121362832, 0.07222454080590951, 0.03163626095469442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3bee4c4-52e2-466d-9322-029927418d64", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf6c3dc9-6acb-437e-aa1b-bfb6eed1c7a8", 3, 0, 0.0, 463.33333333333337, 205, 894, 291.0, 894.0, 894.0, 894.0, 0.019025754529715055, 0.026228538552520594, 0.012200760554537324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 255.06666666666666, 172, 519, 181.0, 415.20000000000005, 519.0, 519.0, 0.09108076434977443, 0.1411573955303633, 0.20484277372805715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 376.7142857142857, 170, 1185, 299.5, 1100.5, 1185.0, 1185.0, 0.06910372469076083, 11.902094675804811, 0.15289006276098996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 105.63636363636364, 85, 260, 90.0, 227.0000000000001, 260.0, 260.0, 0.05865728150162641, 0.0486328437450008, 0.020850830533781263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 101.73333333333332, 86, 258, 91.0, 161.40000000000006, 258.0, 258.0, 0.0731346994895198, 0.056779380951336174, 0.02599710020916524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ca60a0c-7e46-4b5c-8e9f-4a6e5f98ca83", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7455dff-514f-4581-89cd-dc63cdbccdd6", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaedce7d-87a7-4050-8694-dd7feed480e8", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c1febaa-e3b2-440f-932a-1d53e4617db3", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 120.33333333333334, 85, 263, 88.0, 259.6, 262.7, 263.0, 0.11837321383275556, 0.08797071848313182, 0.05941780459964488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 126.80952380952382, 83, 261, 87.0, 256.8, 260.6, 261.0, 0.11837187935087116, 0.03167372552943232, 0.06750896244229371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 155.04761904761907, 83, 348, 88.0, 261.0, 339.39999999999986, 348.0, 0.11837521561199987, 0.03190581983292184, 0.06959167949064836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 188.57142857142856, 84, 356, 254.0, 262.4, 346.6999999999999, 356.0, 0.11837521561199987, 0.03190581983292184, 0.06970728028714446], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.36284470246734396], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07256894049346879], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07256894049346879], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.43541364296081275], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1378, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
