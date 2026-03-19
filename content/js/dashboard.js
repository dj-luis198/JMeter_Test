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

    var data = {"OkPercent": 97.3721590909091, "KoPercent": 2.627840909090909};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7908038976857491, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3017241379310345, 500, 1500, "see books"], "isController": true}, {"data": [0.71875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.71875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5ee7655-bd0d-4b86-bfd4-dbd6f0087992"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d95de273-886c-415c-a619-ca76ea81d2ff"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/471adc8d-f3b6-40c0-b637-254ccfa2bdf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04fdc77b-526c-4cee-804f-2efb95171c6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91d73537-b595-42b2-ae1e-2769300be8a2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf5cc3d3-498c-4207-8e3b-03a85e24f7f2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/888f1e42-19aa-45ce-be66-35a8dce552b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/596b6e1a-c1a3-414c-9035-5d607c955b81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/004b2fa0-cf3b-4a24-8dbb-c84f7ad48c7c"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57fdd162-3c06-4e82-965d-f4b96d261da8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bdb0444-1d80-4720-8229-70270978d7da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d39e49c1-64ee-41f1-a082-0f49c024045d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a2ad91a-cc22-4ce3-9d90-afc0946f5281"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d95de273-886c-415c-a619-ca76ea81d2ff"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=596b6e1a-c1a3-414c-9035-5d607c955b81"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3359375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04fdc77b-526c-4cee-804f-2efb95171c6c"], "isController": false}, {"data": [0.5344827586206896, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91d73537-b595-42b2-ae1e-2769300be8a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9139784946236559, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=471adc8d-f3b6-40c0-b637-254ccfa2bdf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=888f1e42-19aa-45ce-be66-35a8dce552b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=004b2fa0-cf3b-4a24-8dbb-c84f7ad48c7c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf5cc3d3-498c-4207-8e3b-03a85e24f7f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57fdd162-3c06-4e82-965d-f4b96d261da8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d39e49c1-64ee-41f1-a082-0f49c024045d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/ba533cbf-4592-4c07-a972-bb86cdae78aa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a2ad91a-cc22-4ce3-9d90-afc0946f5281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bdb0444-1d80-4720-8229-70270978d7da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1408, 37, 2.627840909090909, 317.12642045454595, 98, 2549, 115.0, 809.0, 975.55, 1329.3700000000006, 5.53009147431139, 774.1500986999081, 4.0546289538877565], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1468.724137931034, 1196, 1858, 1445.5, 1743.3, 1795.0499999999997, 1858.0, 0.25398604828362364, 305.63082176802754, 1.248847415144575], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 435.6875, 106, 931, 418.0, 823.2000000000002, 931.0, 931.0, 0.09223231013114282, 0.01863898796656579, 0.06186162451361868], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 435.6875, 106, 931, 418.0, 823.2000000000002, 931.0, 931.0, 0.0933505253884257, 0.018864965183171236, 0.06261162863118958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5ee7655-bd0d-4b86-bfd4-dbd6f0087992", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 161.42857142857142, 102, 307, 102.5, 305.0, 307.0, 307.0, 0.11134706083526202, 0.04173961390406655, 0.06283466253887206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 118.57142857142857, 101, 304, 104.0, 208.5, 304.0, 304.0, 0.11151824119802453, 0.08287634917157878, 0.055976929663852155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 224.7857142857143, 101, 703, 103.5, 559.5, 703.0, 703.0, 0.11152001784320285, 2.3700959818939284, 0.06498592557631952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 238.85714285714286, 100, 896, 103.5, 656.5, 896.0, 896.0, 0.11134174758825821, 7.183973660220775, 0.0647733101901558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d95de273-886c-415c-a619-ca76ea81d2ff", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 184.23529411764707, 101, 285, 191.0, 276.2, 285.0, 285.0, 0.094948727687049, 0.16744749195728423, 0.06136105161301132], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/471adc8d-f3b6-40c0-b637-254ccfa2bdf5", 3, 0, 0.0, 988.3333333333333, 285, 2232, 448.0, 2232.0, 2232.0, 2232.0, 0.017254568146916897, 0.023786815137432638, 0.01106494116192262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 103.85000000000001, 101, 112, 103.0, 106.9, 111.75, 112.0, 0.10676688518289168, 0.07934531213298883, 0.05359197166406867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 102.39999999999999, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.10676973505090248, 0.028569245511667264, 0.060892114521217816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 523.1, 499, 706, 503.0, 686.4000000000001, 706.0, 706.0, 0.07466642773409791, 21.954408912558147, 0.042583197067102715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 762.1, 700, 911, 706.0, 910.1, 911.0, 911.0, 0.07455231335828351, 67.08230260877183, 0.04244531121863212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 243.19999999999996, 101, 307, 302.0, 306.9, 307.0, 307.0, 0.07488841625977294, 0.1325173928346763, 0.041466535175089116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 140.29411764705878, 101, 309, 105.0, 304.2, 309.0, 309.0, 0.09897819568571513, 0.07355703800471602, 0.049682414631306224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 156.70588235294116, 100, 409, 104.0, 327.3999999999999, 409.0, 409.0, 0.09898165345940878, 0.02648532524206837, 0.056450474238569075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 137.70588235294122, 99, 309, 103.0, 303.4, 309.0, 309.0, 0.09898280610432789, 0.02667895945780712, 0.05819106374492713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 150.41176470588232, 101, 306, 104.0, 305.2, 306.0, 306.0, 0.09898280610432789, 0.02667895945780712, 0.05828772664151338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 102.6, 100, 106, 103.0, 105.8, 106.0, 106.0, 0.0748889770914619, 0.05565479645176026, 0.04205191584725644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 510.6842105263158, 99, 1016, 699.0, 917.0, 1016.0, 1016.0, 0.08987956138774042, 42.57662639135926, 0.04877407530488093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 125.65, 100, 365, 103.0, 285.8000000000004, 362.04999999999995, 365.0, 0.1067708750407064, 0.028778087413315393, 0.06276959645947779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 417.78947368421063, 101, 805, 502.0, 750.0, 805.0, 805.0, 0.08979418228219004, 13.907501654103358, 0.04881543307970415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 104.04999999999998, 101, 130, 103.0, 104.9, 128.74999999999997, 130.0, 0.10676973505090248, 0.028777780150438557, 0.06287319358954511], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 482.99999999999994, 105, 791, 545.0, 776.0, 791.0, 791.0, 0.09979575136221201, 0.020309994710825178, 0.06738162352718104], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04fdc77b-526c-4cee-804f-2efb95171c6c", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91d73537-b595-42b2-ae1e-2769300be8a2", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 322.0, 203, 620, 214.0, 609.6, 620.0, 620.0, 0.09891829930349881, 0.15330404394009042, 0.22246957353120872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 486.4166666666667, 104, 1416, 411.5, 801.5, 1272.25, 1416.0, 0.10582943822206543, 0.06500655922038981, 0.047850615133609664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 104.3157894736842, 101, 119, 104.0, 108.0, 119.0, 119.0, 0.08987148377819719, 0.06678925698750786, 0.04511127213085288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 156.36842105263156, 99, 312, 103.0, 307.0, 312.0, 312.0, 0.08979248484161079, 0.09500761168531043, 0.04724074192222081], "isController": false}, {"data": ["login", 24, 0, 0.0, 2458.5833333333335, 1358, 4007, 2383.0, 3578.0, 3980.5, 4007.0, 0.10383362392326695, 51.895661606760434, 0.22840355262417852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 118.60000000000001, 104, 307, 106.5, 120.0, 297.64999999999986, 307.0, 0.10535243021718403, 0.08529019985356012, 0.03744949667876464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf5cc3d3-498c-4207-8e3b-03a85e24f7f2", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/888f1e42-19aa-45ce-be66-35a8dce552b4", 3, 0, 0.0, 460.6666666666667, 191, 813, 378.0, 813.0, 813.0, 813.0, 0.04737166227162911, 0.03045541438361572, 0.030378312068720492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/596b6e1a-c1a3-414c-9035-5d607c955b81", 3, 0, 0.0, 475.33333333333337, 185, 941, 300.0, 941.0, 941.0, 941.0, 0.0357564272177924, 0.029063736576441283, 0.022929740110368173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/004b2fa0-cf3b-4a24-8dbb-c84f7ad48c7c", 3, 0, 0.0, 336.0, 187, 424, 397.0, 424.0, 424.0, 424.0, 0.02636736774567795, 0.026444615893370365, 0.016908761217117697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 630.2105263157894, 202, 1122, 819.0, 1030.0, 1122.0, 1122.0, 0.08974116757982241, 56.57200455643066, 0.189745189696297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57fdd162-3c06-4e82-965d-f4b96d261da8", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bdb0444-1d80-4720-8229-70270978d7da", 3, 0, 0.0, 265.0, 203, 386, 206.0, 386.0, 386.0, 386.0, 0.08460714084268713, 0.03828252792035648, 0.054256532376332565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d39e49c1-64ee-41f1-a082-0f49c024045d", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 445.21428571428567, 207, 1000, 410.5, 804.5, 1000.0, 1000.0, 0.11124796376494896, 9.66661462265088, 0.24816614684731217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 563.1176470588236, 101, 1013, 804.0, 1005.0, 1013.0, 1013.0, 0.11496584838033408, 80.91803347112328, 0.18374194816392778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a2ad91a-cc22-4ce3-9d90-afc0946f5281", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["register", 25, 10, 40.0, 802.84, 115, 1432, 900.0, 1261.2000000000005, 1424.5, 1432.0, 0.1016189938093709, 0.031517766048687695, 0.04584763197258726], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 232.60000000000002, 202, 471, 208.0, 400.40000000000043, 468.4, 471.0, 0.10670764240134878, 0.16537600438568412, 0.2399879887210022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 108.75000000000001, 103, 134, 105.5, 122.10000000000001, 134.0, 134.0, 0.10774338219944646, 0.08364842660992182, 0.03829940539120948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 336.1764705882353, 204, 1007, 208.0, 845.3999999999999, 1007.0, 1007.0, 0.0979155507173754, 13.915195818502008, 0.2172670023874115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 128.125, 101, 309, 103.0, 304.1, 309.0, 309.0, 0.07222595891245763, 0.05367573704334009, 0.03625404578222971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 202.6875, 101, 304, 209.5, 303.3, 304.0, 304.0, 0.07216341405111876, 0.019309351025397013, 0.04115569707602867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 186.3125, 100, 410, 104.5, 336.50000000000006, 410.0, 410.0, 0.07222791518637059, 0.01946768026507645, 0.0424621142013624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 141.5625, 99, 304, 101.5, 304.0, 304.0, 304.0, 0.07222824124232574, 0.01946776814734561, 0.04253284127843987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 106.0, 105, 107, 106.0, 107.0, 107.0, 107.0, 0.06311537490532694, 0.018614104708406968, 0.039015656557687454], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 934.4310344827586, 789, 1431, 812.0, 1313.2, 1334.9499999999998, 1431.0, 0.25820352670403196, 308.901184007853, 0.5098511044878444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d95de273-886c-415c-a619-ca76ea81d2ff", 3, 0, 0.0, 528.3333333333334, 218, 976, 391.0, 976.0, 976.0, 976.0, 0.02909683426443203, 0.029182078896066107, 0.01865910270212601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 802.84, 115, 1432, 900.0, 1261.2000000000005, 1424.5, 1432.0, 0.09916581714616644, 0.030756897974240686, 0.044740827657743065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 101.33333333333333, 99, 103, 102.0, 103.0, 103.0, 103.0, 0.02884088483834684, 0.007773519741585672, 0.016983450739768695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 103.33333333333333, 101, 106, 103.0, 106.0, 106.0, 106.0, 0.028840330317916576, 0.007773370281000952, 0.016954959815806425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=596b6e1a-c1a3-414c-9035-5d607c955b81", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 188.8125, 99, 683, 103.0, 420.5000000000003, 683.0, 683.0, 0.10589013898080742, 5.981765232048312, 0.06168307412309729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 202.93750000000003, 98, 707, 103.0, 427.7000000000003, 707.0, 707.0, 0.10574946629566229, 1.9700872557022098, 0.06170440049966623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 117.12499999999999, 100, 308, 103.0, 175.70000000000013, 308.0, 308.0, 0.10588873740916731, 0.07869270426599251, 0.05315118264483594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 169.0, 101, 302, 104.0, 302.0, 302.0, 302.0, 0.028784709562280516, 0.007702158613344592, 0.016416279672238108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 114.5625, 99, 303, 102.0, 163.70000000000016, 303.0, 303.0, 0.10575016523463318, 0.03822341787838731, 0.05975555601454064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 108.0, 102, 118, 104.0, 118.0, 118.0, 118.0, 0.02883561775505104, 0.021429594835540862, 0.014474128443453353], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 462.33333333333337, 103, 1009, 397.0, 968.2, 1009.0, 1009.0, 0.09929369087888155, 0.019664805185778494, 0.06756625371523893], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 106.0, 104, 107, 107.0, 107.0, 107.0, 107.0, 0.02764110785560285, 0.02175657512853115, 0.009825550058046325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1227.6666666666665, 797, 2549, 1064.0, 2051.0, 2482.25, 2549.0, 0.1051018173855923, 0.05439840157652726, 0.04834273045763083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 279.0, 210, 405, 222.0, 405.0, 405.0, 405.0, 0.028751880852205747, 0.04455979971918997, 0.0646636539088182], "isController": false}, {"data": ["addBook", 64, 14, 21.875, 937.2187499999999, 518, 2352, 825.0, 1515.0, 1704.0, 2352.0, 0.2905762490238454, 77.18656853853767, 1.0585664020644534], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 172.9137931034483, 101, 427, 104.0, 412.2, 417.05, 427.0, 0.2592456844533045, 0.19266207604391086, 0.12531895879334543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04fdc77b-526c-4cee-804f-2efb95171c6c", 3, 0, 0.0, 542.3333333333334, 274, 953, 400.0, 953.0, 953.0, 953.0, 0.02639009843506716, 0.026467413176576148, 0.016923337863633564], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 578.431034482759, 489, 827, 508.5, 714.1, 732.3499999999998, 827.0, 0.259186600946478, 76.20946648337407, 0.13035263621819937], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 158.72413793103448, 99, 424, 105.0, 308.0, 310.99999999999994, 424.0, 0.2596542122180737, 0.45946624271401326, 0.1262771461763679], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 756.9655172413792, 685, 1019, 706.0, 913.1, 994.15, 1019.0, 0.258728749671013, 232.80458375060778, 0.12986970442470772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91d73537-b595-42b2-ae1e-2769300be8a2", 3, 0, 0.0, 512.6666666666666, 186, 1009, 343.0, 1009.0, 1009.0, 1009.0, 0.039046738946518986, 0.03255165964909997, 0.02503973819161536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 118.76470588235294, 102, 305, 106.0, 156.19999999999987, 305.0, 305.0, 0.09922198292214576, 0.07412579778851709, 0.035270314241856504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 14, 7.526881720430108, 163.09677419354836, 100, 1039, 108.0, 274.80000000000007, 318.3, 1020.7299999999999, 0.780731873168848, 1.6511316611434783, 0.37627731381013946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 130.25000000000003, 103, 307, 105.0, 304.9, 307.0, 307.0, 0.07517136722622353, 0.05821376387733912, 0.026721071943696644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=471adc8d-f3b6-40c0-b637-254ccfa2bdf5", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 109.57142857142857, 102, 136, 107.0, 126.0, 136.0, 136.0, 0.12091480688177987, 0.09812519972535065, 0.04298143525875769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 366.43750000000006, 206, 614, 405.5, 608.4, 614.0, 614.0, 0.07212828014624009, 0.11178474667195608, 0.16221819255545988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=888f1e42-19aa-45ce-be66-35a8dce552b4", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=004b2fa0-cf3b-4a24-8dbb-c84f7ad48c7c", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 333.875, 204, 813, 212.5, 671.6000000000001, 813.0, 813.0, 0.10567612908339168, 8.055128109602657, 0.23597820182159226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf5cc3d3-498c-4207-8e3b-03a85e24f7f2", 3, 0, 0.0, 595.0, 194, 1193, 398.0, 1193.0, 1193.0, 1193.0, 0.03911546886408678, 0.03260895695342651, 0.02508381304109732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 120.88235294117646, 104, 307, 106.0, 170.9999999999999, 307.0, 307.0, 0.10069300479772553, 0.08348472761061422, 0.035793216549191494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 127.52631578947367, 102, 306, 106.0, 306.0, 306.0, 306.0, 0.08559406788060078, 0.0664524257471461, 0.030426016316932307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57fdd162-3c06-4e82-965d-f4b96d261da8", 3, 0, 0.0, 299.0, 195, 399, 303.0, 399.0, 399.0, 399.0, 0.027057009118212075, 0.03198046878523048, 0.017351011706665947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d39e49c1-64ee-41f1-a082-0f49c024045d", 3, 0, 0.0, 276.6666666666667, 192, 397, 241.0, 397.0, 397.0, 397.0, 0.03062130630492697, 0.02552772312725194, 0.019636710097886107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba533cbf-4592-4c07-a972-bb86cdae78aa", 2, 0, 0.0, 510.0, 224, 796, 510.0, 796.0, 796.0, 796.0, 0.020654755757513167, 0.029025579624083447, 0.012838625038727668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a2ad91a-cc22-4ce3-9d90-afc0946f5281", 3, 0, 0.0, 427.66666666666663, 190, 882, 211.0, 882.0, 882.0, 882.0, 0.04252665003402132, 0.035203538748865955, 0.027271321799160808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bdb0444-1d80-4720-8229-70270978d7da", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 103.29411764705883, 100, 111, 103.0, 107.0, 111.0, 111.0, 0.09797367389750801, 0.07281051351172227, 0.04917819178058508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 148.76470588235293, 98, 304, 103.0, 303.2, 304.0, 304.0, 0.09797367389750801, 0.04352759615827936, 0.054907580568938893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 207.70588235294122, 99, 903, 102.0, 742.1999999999998, 903.0, 903.0, 0.0979742385384549, 10.394758288188342, 0.056607587960695045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 208.35294117647058, 99, 707, 103.0, 700.6, 707.0, 707.0, 0.09797480318591006, 3.4124587929504244, 0.056703592721624764], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.7102272727272727], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2840909090909091], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.21306818181818182], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.4204545454545454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1408, 37, "401/Unauthorized", 20, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
