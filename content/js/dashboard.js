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

    var data = {"OkPercent": 99.30394431554524, "KoPercent": 0.6960556844547564};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7967398536260811, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ef19468-8335-4652-a8e7-b3c860740f2a"], "isController": false}, {"data": [0.16964285714285715, 500, 1500, "see books"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=535c93a9-a263-459a-95fa-6b314cd009aa"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0258b24-5448-4a48-b7ed-ee4e25d3a8b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be1f2f81-29ba-4dc7-a5b7-56d6d5e914ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18f3668d-c909-49f6-a6e4-4373b0ea176b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31dae0d7-b347-479d-9327-f0ec52e291c0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5ab137e-7488-403b-8d7c-3c217fa8307f"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fa7031f1-a840-47d6-a787-1009ebe60d8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dae165a-dd5f-4c2a-bb9e-282e9064f4de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25bd81a6-a092-46d5-b37c-a0f81e7fa53b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e0b4159-2e38-4371-964d-a70789068820"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5030ad39-f50d-4319-91e8-2f0530a525d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/535c93a9-a263-459a-95fa-6b314cd009aa"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ef19468-8335-4652-a8e7-b3c860740f2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0258b24-5448-4a48-b7ed-ee4e25d3a8b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37b8a47b-fd46-4da1-a406-e88c7718378f"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18f3668d-c909-49f6-a6e4-4373b0ea176b"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7906c8ce-2bc1-429c-91dc-1d087d95a402"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/262e5ef0-0c03-41ca-8412-3abee87f5bed"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5803571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58ddc9a3-c2ff-4da5-937c-a65b0cede887"], "isController": false}, {"data": [0.9676470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be1f2f81-29ba-4dc7-a5b7-56d6d5e914ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25bd81a6-a092-46d5-b37c-a0f81e7fa53b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3dae165a-dd5f-4c2a-bb9e-282e9064f4de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58ddc9a3-c2ff-4da5-937c-a65b0cede887"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa7031f1-a840-47d6-a787-1009ebe60d8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=262e5ef0-0c03-41ca-8412-3abee87f5bed"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37b8a47b-fd46-4da1-a406-e88c7718378f"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e0b4159-2e38-4371-964d-a70789068820"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5ab137e-7488-403b-8d7c-3c217fa8307f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 9, 0.6960556844547564, 358.4972931167831, 93, 2329, 119.0, 979.6000000000001, 1174.0, 1575.2999999999997, 5.049834406048866, 722.7866271656096, 3.6936662632592325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ef19468-8335-4652-a8e7-b3c860740f2a", 1, 0, 0.0, 1203.0, 1203, 1203, 1203.0, 1203.0, 1203.0, 1203.0, 0.8312551953449709, 0.15017794056525352, 0.5731114921030757], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1658.3928571428569, 1272, 2668, 1652.0, 1994.7, 2164.7, 2668.0, 0.25012282817455, 300.9822677291304, 1.2298519920496673], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 729.0, 390, 2086, 622.0, 1679.5999999999997, 2086.0, 2086.0, 0.10046212577858148, 0.018149895770544506, 0.0682828511151296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 729.0, 390, 2086, 622.0, 1679.5999999999997, 2086.0, 2086.0, 0.10201519241634753, 0.018430479098656537, 0.06933845109548623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 162.875, 97, 306, 102.5, 305.3, 306.0, 306.0, 0.09318904562768646, 0.04243104738662971, 0.05216857461530398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 101.99999999999999, 96, 111, 102.0, 108.2, 111.0, 111.0, 0.093185789167152, 0.06925232964472919, 0.0467748980780431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 214.87500000000003, 95, 842, 102.5, 802.1, 842.0, 842.0, 0.09318741736896975, 3.4470016584448184, 0.05387397566643564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 213.375, 96, 951, 100.5, 890.8000000000001, 951.0, 951.0, 0.0931885028684586, 10.503374898075075, 0.053783598823495156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=535c93a9-a263-459a-95fa-6b314cd009aa", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 267.7692307692308, 196, 405, 233.0, 387.0, 405.0, 405.0, 0.10074317464991747, 0.23663899700482793, 0.06512888829906774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0258b24-5448-4a48-b7ed-ee4e25d3a8b4", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 124.81250000000001, 97, 306, 101.0, 287.8, 306.0, 306.0, 0.09156199032876476, 0.06804558070331054, 0.045959827176743254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 122.6875, 96, 294, 98.0, 289.1, 294.0, 294.0, 0.09156303829051807, 0.02450026610508003, 0.05221954527506109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 707.6666666666666, 557, 806, 753.0, 806.0, 806.0, 806.0, 0.09854482146963178, 28.9754495080971, 0.05620134349439937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1069.3333333333333, 874, 1166, 1089.5, 1166.0, 1166.0, 1166.0, 0.09810814788168157, 88.27788391966578, 0.05585649435060582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 133.16666666666669, 95, 299, 100.0, 299.0, 299.0, 299.0, 0.0996512207274539, 0.17633594917787743, 0.055177970852017935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be1f2f81-29ba-4dc7-a5b7-56d6d5e914ce", 3, 0, 0.0, 441.3333333333333, 360, 505, 459.0, 505.0, 505.0, 505.0, 0.026146297248537984, 0.026222897728758313, 0.016766994003782495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 115.33333333333333, 97, 286, 100.0, 231.4000000000002, 286.0, 286.0, 0.06115833893951441, 0.04545067962204147, 0.030698619350498443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 164.41666666666666, 96, 305, 102.0, 301.7, 305.0, 305.0, 0.061100729644546506, 0.01634921867441967, 0.03484650987540543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 165.58333333333334, 95, 307, 102.5, 307.0, 307.0, 307.0, 0.061094197069515015, 0.01646679530389272, 0.03591670569907035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 138.91666666666666, 95, 364, 102.0, 346.30000000000007, 364.0, 364.0, 0.061158962336272354, 0.016484251567198408, 0.03601450614137913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18f3668d-c909-49f6-a6e4-4373b0ea176b", 3, 0, 0.0, 386.3333333333333, 233, 503, 423.0, 503.0, 503.0, 503.0, 0.026836271905106943, 0.022372295686516563, 0.017209458220397357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 105.66666666666667, 100, 124, 101.0, 124.0, 124.0, 124.0, 0.09963136395337252, 0.07404244918800439, 0.055945345969911325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 615.05, 97, 1313, 544.5, 1209.1000000000001, 1308.0, 1313.0, 0.0914783356431613, 41.16851174181612, 0.04984854618055079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 161.3125, 96, 305, 102.5, 297.3, 305.0, 305.0, 0.09146306607063236, 0.024652154526850125, 0.05377027907668035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31dae0d7-b347-479d-9327-f0ec52e291c0", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 409.8000000000001, 96, 896, 344.0, 814.0, 891.9499999999999, 896.0, 0.09147875405936971, 13.461223728445319, 0.04993810890545671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 123.75, 94, 298, 99.0, 291.0, 298.0, 298.0, 0.09156094239099956, 0.0246785352538241, 0.05391723463063743], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 705.0, 452, 1203, 693.0, 1125.3999999999999, 1203.0, 1203.0, 0.10333124021333927, 0.018668241640105238, 0.07124204647521243], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 338.9166666666667, 197, 592, 389.0, 553.9000000000001, 592.0, 592.0, 0.061062797999175654, 0.09463541057098804, 0.13733166385947415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5ab137e-7488-403b-8d7c-3c217fa8307f", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 462.0909090909091, 148, 1524, 328.0, 1029.8999999999996, 1468.6499999999992, 1524.0, 0.0955794504181601, 0.05871042413381123, 0.04321609916367981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 103.4, 97, 131, 101.5, 110.60000000000001, 130.0, 131.0, 0.09147164150434262, 0.06797843670391088, 0.04591447630198448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 158.19999999999996, 97, 303, 101.0, 298.6, 302.8, 303.0, 0.09147791723078048, 0.09317526139814848, 0.04832964181821508], "isController": false}, {"data": ["login", 22, 0, 0.0, 2457.363636363636, 1547, 4046, 2130.5, 3761.7, 4029.5, 4046.0, 0.09333740623833282, 30.5811344021527, 0.18303710639191528], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa7031f1-a840-47d6-a787-1009ebe60d8f", 3, 0, 0.0, 1045.0, 405, 1580, 1150.0, 1580.0, 1580.0, 1580.0, 0.03265163965650475, 0.027220328502704644, 0.020938714232849726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 105.56249999999999, 99, 120, 104.5, 113.7, 120.0, 120.0, 0.09443818135672252, 0.07645434799289352, 0.03356982227914746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dae165a-dd5f-4c2a-bb9e-282e9064f4de", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25bd81a6-a092-46d5-b37c-a0f81e7fa53b", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 720.6, 196, 1416, 658.5, 1310.7, 1410.8999999999999, 1416.0, 0.09143066127225766, 54.76227849493703, 0.19393300418295276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e0b4159-2e38-4371-964d-a70789068820", 3, 0, 0.0, 615.6666666666666, 344, 984, 519.0, 984.0, 984.0, 984.0, 0.016633123201543552, 0.022930103111502915, 0.010666423407239844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 368.4375, 197, 1056, 211.5, 991.6, 1056.0, 1056.0, 0.09313154831199069, 14.05350743961001, 0.20647646245634457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1175.5, 982, 1267, 1193.5, 1267.0, 1267.0, 1267.0, 0.09793519954296906, 117.16454643760711, 0.2208323981881988], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 870.4782608695652, 122, 1575, 900.0, 1394.6000000000001, 1550.1999999999996, 1575.0, 0.09456187018710915, 0.029791485937005348, 0.04266365627582464], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 117.42105263157895, 99, 312, 106.0, 119.0, 312.0, 312.0, 0.09035098981887005, 0.07014554385351728, 0.03211695341217646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 311.9375, 199, 611, 209.5, 584.4, 611.0, 611.0, 0.09141081161374362, 0.1416689043271593, 0.2055850577602066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 471.30769230769226, 201, 1243, 400.0, 1233.4, 1243.0, 1243.0, 0.09625850591989811, 17.84294435564186, 0.2126986141551835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5030ad39-f50d-4319-91e8-2f0530a525d1", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 100.12500000000001, 97, 105, 99.5, 105.0, 105.0, 105.0, 0.04523070486399692, 0.033613834376466464, 0.022703693652435956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 147.5, 95, 293, 102.0, 293.0, 293.0, 293.0, 0.04523198353555799, 0.020595129222122963, 0.025321518126717398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 205.25, 96, 952, 99.0, 952.0, 952.0, 952.0, 0.04523198353555799, 5.098144790759671, 0.02610556862257302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 207.75, 98, 761, 103.0, 761.0, 761.0, 761.0, 0.04523044913835995, 1.6730738719243292, 0.02614885340811434], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1133.7857142857142, 774, 2236, 1016.5, 1510.2000000000003, 1728.9499999999998, 2236.0, 0.24578543809059825, 294.04483280006673, 0.4853302302921774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/535c93a9-a263-459a-95fa-6b314cd009aa", 3, 0, 0.0, 454.0, 196, 958, 208.0, 958.0, 958.0, 958.0, 0.01901598610565282, 0.02247625180651868, 0.012194496298221372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 870.4782608695652, 122, 1575, 900.0, 1394.6000000000001, 1550.1999999999996, 1575.0, 0.0958824731007975, 0.03020753865522747, 0.04325947516852387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 168.55555555555554, 97, 308, 101.0, 308.0, 308.0, 308.0, 0.057551748613962055, 0.01551199474360696, 0.03389033634201086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 200.33333333333334, 95, 393, 111.0, 393.0, 393.0, 393.0, 0.05763024435223605, 0.015533151798063622, 0.03388028037113877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ef19468-8335-4652-a8e7-b3c860740f2a", 3, 0, 0.0, 485.0, 285, 854, 316.0, 854.0, 854.0, 854.0, 0.03827311696264544, 0.024605926432690346, 0.024543632948050623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 109.78947368421053, 96, 287, 100.0, 104.0, 287.0, 287.0, 0.09026171145706155, 0.024328351916161124, 0.053064013962061576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 138.7368421052632, 93, 295, 100.0, 293.0, 295.0, 295.0, 0.09026428432299412, 0.024329045383932008, 0.053153675240981885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 122.47368421052633, 96, 314, 100.0, 305.0, 314.0, 314.0, 0.0902595675141565, 0.06707766687331357, 0.04530607197487934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 142.44444444444446, 95, 295, 101.0, 295.0, 295.0, 295.0, 0.05762987532736971, 0.015420493984081346, 0.032867038272640536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 120.68421052631581, 96, 305, 100.0, 292.0, 305.0, 305.0, 0.0902608538676776, 0.024151830038812168, 0.05147689322140987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 183.33333333333334, 96, 437, 103.0, 437.0, 437.0, 437.0, 0.057553220742180757, 0.04277148533671831, 0.028889019005352446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 103.22222222222223, 101, 107, 103.0, 107.0, 107.0, 107.0, 0.05779196178024928, 0.045488594916875895, 0.020543236414072987], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 637.3076923076923, 401, 1580, 505.0, 1331.1999999999998, 1580.0, 1580.0, 0.10148083963685472, 0.018333940754705198, 0.06907436057313256], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0258b24-5448-4a48-b7ed-ee4e25d3a8b4", 3, 0, 0.0, 401.0, 304, 450, 449.0, 450.0, 450.0, 450.0, 0.026421242679114006, 0.026670661962217623, 0.016943309921176625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37b8a47b-fd46-4da1-a406-e88c7718378f", 3, 0, 0.0, 388.0, 196, 493, 475.0, 493.0, 493.0, 493.0, 0.05006926247976367, 0.031146601757431114, 0.0321082184521922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1315.4090909090905, 717, 2329, 1179.0, 1922.4999999999998, 2279.0499999999993, 2329.0, 0.09445059804401397, 0.04888556344074942, 0.043443585623760335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 408.44444444444446, 198, 739, 405.0, 739.0, 739.0, 739.0, 0.05743972020474069, 0.08902034762199558, 0.1291832769839041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18f3668d-c909-49f6-a6e4-4373b0ea176b", 1, 0, 0.0, 1009.0, 1009, 1009, 1009.0, 1009.0, 1009.0, 1009.0, 0.9910802775024776, 0.179052589197225, 0.6833033944499505], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 1087.5789473684208, 509, 2931, 859.0, 1781.2, 1856.1, 2931.0, 0.275575323921872, 87.78561289825468, 1.0028226074502031], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7906c8ce-2bc1-429c-91dc-1d087d95a402", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.79833984375, 1.49169921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/262e5ef0-0c03-41ca-8412-3abee87f5bed", 3, 0, 0.0, 386.0, 208, 617, 333.0, 617.0, 617.0, 617.0, 0.02690100430416069, 0.026979815840208036, 0.01725096955703013], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 178.96428571428572, 98, 683, 104.0, 402.90000000000003, 407.34999999999997, 683.0, 0.24670907713183077, 0.1833453200169172, 0.11925878240259397], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 647.3214285714289, 475, 920, 604.5, 858.6, 888.5, 920.0, 0.24695713529723057, 72.61359752601871, 0.12420207488093139], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 140.60714285714286, 95, 310, 103.0, 295.3, 304.75, 310.0, 0.2473891608206252, 0.4377628509833719, 0.12031230672721811], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 953.3750000000001, 670, 1518, 905.5, 1225.6000000000001, 1322.6499999999999, 1518.0, 0.246562435332397, 221.85731272262169, 0.12376278492270708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 120.84615384615387, 101, 292, 105.0, 224.39999999999992, 292.0, 292.0, 0.1031770597712644, 0.07708051828614967, 0.03667622046556664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58ddc9a3-c2ff-4da5-937c-a65b0cede887", 3, 0, 0.0, 535.6666666666666, 208, 960, 439.0, 960.0, 960.0, 960.0, 0.022273864589752536, 0.030706320487500646, 0.014283695716735838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, 1.7647058823529411, 182.57647058823537, 96, 2316, 108.0, 345.6, 399.1499999999999, 1522.2199999999912, 0.6819148168055901, 1.4551877296448428, 0.3278307048692729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 152.0, 98, 309, 103.0, 309.0, 309.0, 309.0, 0.04354405024983399, 0.03372112485167808, 0.015478549112245674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 107.31249999999999, 103, 123, 106.0, 115.30000000000001, 123.0, 123.0, 0.09309578392468551, 0.07554941058731802, 0.03309264194197805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be1f2f81-29ba-4dc7-a5b7-56d6d5e914ce", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25bd81a6-a092-46d5-b37c-a0f81e7fa53b", 3, 0, 0.0, 270.0, 187, 401, 222.0, 401.0, 401.0, 401.0, 0.048233062156339435, 0.030569587245570597, 0.030930707177079648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dae165a-dd5f-4c2a-bb9e-282e9064f4de", 3, 0, 0.0, 536.0, 213, 922, 473.0, 922.0, 922.0, 922.0, 0.03793722653582539, 0.02438998125268722, 0.024328234464705733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58ddc9a3-c2ff-4da5-937c-a65b0cede887", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa7031f1-a840-47d6-a787-1009ebe60d8f", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=262e5ef0-0c03-41ca-8412-3abee87f5bed", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 333.37500000000006, 199, 1050, 206.0, 1050.0, 1050.0, 1050.0, 0.04520463573539466, 6.821358563523813, 0.10022053152175756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37b8a47b-fd46-4da1-a406-e88c7718378f", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 265.8421052631578, 197, 611, 204.0, 610.0, 611.0, 611.0, 0.09021499658132644, 0.1398156245845362, 0.20289564172538554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e0b4159-2e38-4371-964d-a70789068820", 1, 0, 0.0, 862.0, 862, 862, 862.0, 862.0, 862.0, 862.0, 1.160092807424594, 0.20958707946635732, 0.7998296113689095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 144.66666666666666, 100, 303, 113.5, 302.7, 303.0, 303.0, 0.062250996015936255, 0.05161239806399402, 0.02212828374003984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 117.85000000000001, 98, 352, 105.0, 120.20000000000002, 340.4499999999998, 352.0, 0.09347104734308548, 0.07256785413843062, 0.03322603636023742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5ab137e-7488-403b-8d7c-3c217fa8307f", 3, 0, 0.0, 340.0, 245, 511, 264.0, 511.0, 511.0, 511.0, 0.02266443044286297, 0.026788589498058412, 0.014534156241028662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 102.92307692307693, 98, 111, 103.0, 109.0, 111.0, 111.0, 0.09647352172880551, 0.07169565433166113, 0.048425185711529324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 197.38461538461542, 99, 377, 114.0, 346.59999999999997, 377.0, 377.0, 0.09633483022838765, 0.04803715467668549, 0.05369624701732545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 335.9230769230769, 98, 1140, 288.0, 1128.8, 1140.0, 1140.0, 0.0964792495398682, 13.377726350523957, 0.05544367931039601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 234.84615384615384, 97, 584, 111.0, 582.8, 584.0, 584.0, 0.09647996556407383, 4.386359588253193, 0.055538309504018765], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 66.66666666666667, 0.46403712296983757], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.23201856148491878], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 9, "406/Not Acceptable", 6, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
