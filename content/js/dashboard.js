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

    var data = {"OkPercent": 97.9498861047836, "KoPercent": 2.050113895216401};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7743506493506493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04439505-86ef-4977-aa67-7b2c1f67922b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/584a9ce1-f093-489a-b690-88639488af43"], "isController": false}, {"data": [0.07272727272727272, 500, 1500, "see books"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3b90787-619c-4503-80e1-62f640ce5b36"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acfd997f-961b-407c-b0ee-0c7fc1b45c5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e405f9e9-ac8f-4a2b-8296-579a7aa59398"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7387123-f50c-447a-9395-45e01a7484d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f122df77-762f-49bb-aad0-24a80202c6fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc43900a-c7eb-46b1-8fb4-eaa06691b62f"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c68a445-70b2-44cb-9a67-07915e43930f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adc425b6-6efb-4ef6-b839-2ca9ca3cbcdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6661d257-d1cc-4565-b152-8d990a5b3b26"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7e31dc8-4caf-4988-848e-09102a7059b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aaab493-5db4-49a1-98c4-ccae646e09a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a9369d6-acfd-4108-9086-4f247e39c26e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9247fc2b-d461-448f-ae2c-d6ef494d2038"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acfd997f-961b-407c-b0ee-0c7fc1b45c5e"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adc425b6-6efb-4ef6-b839-2ca9ca3cbcdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04439505-86ef-4977-aa67-7b2c1f67922b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efef3460-0ba4-46c4-a5aa-c0d36d1b1d6c"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dbdbbb7-ae65-4977-b4fa-bf9a9d8bda78"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7387123-f50c-447a-9395-45e01a7484d1"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e405f9e9-ac8f-4a2b-8296-579a7aa59398"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277456647398844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f122df77-762f-49bb-aad0-24a80202c6fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc43900a-c7eb-46b1-8fb4-eaa06691b62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dbdbbb7-ae65-4977-b4fa-bf9a9d8bda78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7e31dc8-4caf-4988-848e-09102a7059b5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c68a445-70b2-44cb-9a67-07915e43930f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aaab493-5db4-49a1-98c4-ccae646e09a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6661d257-d1cc-4565-b152-8d990a5b3b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9247fc2b-d461-448f-ae2c-d6ef494d2038"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 27, 2.050113895216401, 367.74259681093343, 98, 2153, 122.0, 1055.0, 1267.0, 1726.4599999999966, 5.105541664243763, 717.5026099210619, 3.725872426876781], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/04439505-86ef-4977-aa67-7b2c1f67922b", 3, 0, 0.0, 453.66666666666663, 198, 958, 205.0, 958.0, 958.0, 958.0, 0.02031790752643021, 0.024015078850412794, 0.013029387313498541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/584a9ce1-f093-489a-b690-88639488af43", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1753.9272727272728, 1243, 2393, 1728.0, 2098.8, 2165.4, 2393.0, 0.24765515595520593, 298.0126834618138, 1.2177184670258416], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 450.73333333333335, 105, 773, 438.0, 746.6, 773.0, 773.0, 0.09336777566835766, 0.018290601366281783, 0.0628652041642028], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 450.73333333333335, 105, 773, 438.0, 746.6, 773.0, 773.0, 0.09320301480685228, 0.018258324970951728, 0.06275426947476995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 116.53333333333335, 99, 300, 101.0, 197.40000000000006, 300.0, 300.0, 0.09695308763266414, 0.02594252540170896, 0.05529355779050377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 116.86666666666666, 100, 307, 103.0, 186.4000000000001, 307.0, 307.0, 0.09695622103432897, 0.07205437910851986, 0.04866747813637216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 179.73333333333335, 99, 305, 103.0, 299.6, 305.0, 305.0, 0.09695684773896632, 0.026132900367143264, 0.057094706236910826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 184.46666666666664, 100, 306, 107.0, 304.2, 306.0, 306.0, 0.09695308763266414, 0.026131886900991507, 0.05699781128404669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3b90787-619c-4503-80e1-62f640ce5b36", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 217.73333333333332, 101, 342, 208.0, 337.2, 342.0, 342.0, 0.09403268576157073, 0.17047097446072254, 0.06077841824484857], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/acfd997f-961b-407c-b0ee-0c7fc1b45c5e", 3, 0, 0.0, 512.3333333333334, 179, 962, 396.0, 962.0, 962.0, 962.0, 0.03012804418779814, 0.0251165107958825, 0.019320392919909616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 114.17647058823529, 100, 300, 103.0, 145.59999999999985, 300.0, 300.0, 0.1040162510095695, 0.07730113966629139, 0.052211282245037814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 125.1764705882353, 98, 304, 102.0, 302.4, 304.0, 304.0, 0.10401879680845856, 0.04621331425302267, 0.05829546080326987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 668.5714285714286, 585, 806, 610.0, 806.0, 806.0, 806.0, 0.08389865043028022, 24.668988923879954, 0.04784844907351919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e405f9e9-ac8f-4a2b-8296-579a7aa59398", 3, 0, 0.0, 345.0, 218, 592, 225.0, 592.0, 592.0, 592.0, 0.03683919690550746, 0.030351564898385214, 0.023624094369742738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1103.8571428571427, 883, 1411, 1109.0, 1411.0, 1411.0, 1411.0, 0.08378417197299755, 75.389145218168, 0.04770134009790779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 160.85714285714286, 99, 308, 105.0, 308.0, 308.0, 308.0, 0.08458601189037654, 0.14967759135289285, 0.046836199943206536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 114.4736842105263, 100, 309, 103.0, 110.0, 309.0, 309.0, 0.09169751403213273, 0.06814629704927053, 0.04602785372316038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 145.31578947368422, 98, 309, 103.0, 306.0, 309.0, 309.0, 0.0916983991390003, 0.024536485707115314, 0.05229674325896111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 144.2105263157895, 99, 306, 102.0, 305.0, 306.0, 306.0, 0.09169884169884171, 0.02471570342664093, 0.053908889358108114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7387123-f50c-447a-9395-45e01a7484d1", 3, 0, 0.0, 576.3333333333334, 242, 1031, 456.0, 1031.0, 1031.0, 1031.0, 0.028089361622441526, 0.028171654674069773, 0.01801303463418288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 143.52631578947367, 99, 306, 102.0, 302.0, 306.0, 306.0, 0.09169795658343066, 0.024715464860377796, 0.05399791779278192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f122df77-762f-49bb-aad0-24a80202c6fd", 3, 0, 0.0, 894.3333333333334, 204, 2064, 415.0, 2064.0, 2064.0, 2064.0, 0.026826193094937896, 0.026904785457520723, 0.01720299492090744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 130.2857142857143, 99, 299, 103.0, 299.0, 299.0, 299.0, 0.08458498978938338, 0.06286052463839917, 0.04749645422743695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 782.4375, 101, 1406, 1055.5, 1302.4, 1406.0, 1406.0, 0.077300287460444, 43.47964715136362, 0.041292243399280136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 257.1764705882353, 99, 1123, 103.0, 1111.0, 1123.0, 1123.0, 0.10402134273196759, 11.03633700696943, 0.060101485822502874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 509.68750000000006, 99, 1007, 604.0, 949.6, 1007.0, 1007.0, 0.07737654813546699, 14.227367208544305, 0.04140854333812101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 182.82352941176467, 99, 781, 103.0, 640.9999999999999, 781.0, 781.0, 0.10401943327765234, 3.6229930368167604, 0.06020196405516701], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 437.8, 105, 899, 411.0, 891.2, 899.0, 899.0, 0.09338986533181419, 0.01829492869683782, 0.06350024437014762], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 292.84210526315786, 202, 612, 209.0, 414.0, 612.0, 612.0, 0.0916528383436885, 0.14204399848772817, 0.2061293815483541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 647.875, 116, 2073, 564.5, 1057.0, 1829.0, 2073.0, 0.10378198863587224, 0.06374889731637075, 0.04692486400235239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 103.25, 100, 112, 103.0, 107.80000000000001, 112.0, 112.0, 0.07737505138187005, 0.057502357521096795, 0.03883864883816524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 191.9375, 99, 311, 107.5, 311.0, 311.0, 311.0, 0.07737617394163902, 0.0933387879505953, 0.0400671056958536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc43900a-c7eb-46b1-8fb4-eaa06691b62f", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["login", 24, 0, 0.0, 2762.3750000000005, 1298, 5038, 2613.5, 3751.5, 4733.5, 5038.0, 0.10331645831180908, 36.19100788299196, 0.20585098053776218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9c68a445-70b2-44cb-9a67-07915e43930f", 3, 0, 0.0, 330.3333333333333, 217, 492, 282.0, 492.0, 492.0, 492.0, 0.023593623430040976, 0.02788686415184856, 0.015130025441790597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 120.70588235294116, 102, 356, 105.0, 160.79999999999984, 356.0, 356.0, 0.10420306111816013, 0.08435970475288551, 0.037040931881845984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adc425b6-6efb-4ef6-b839-2ca9ca3cbcdc", 3, 0, 0.0, 515.6666666666666, 201, 959, 387.0, 959.0, 959.0, 959.0, 0.03075125311356438, 0.02563605443484322, 0.019720041872956322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6661d257-d1cc-4565-b152-8d990a5b3b26", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 887.2500000000001, 204, 1519, 1157.5, 1410.5, 1519.0, 1519.0, 0.07726072113225586, 57.81407878963837, 0.1614062477365023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7e31dc8-4caf-4988-848e-09102a7059b5", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aaab493-5db4-49a1-98c4-ccae646e09a0", 3, 0, 0.0, 371.0, 334, 408, 371.0, 408.0, 408.0, 408.0, 0.024166458566606788, 0.028563935890413165, 0.015497370890695108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a9369d6-acfd-4108-9086-4f247e39c26e", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 341.8, 203, 605, 398.0, 488.6000000000001, 605.0, 605.0, 0.09688858458696396, 0.150158382558117, 0.2179046975622832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 822.9090909090909, 101, 1516, 997.0, 1493.4, 1516.0, 1516.0, 0.12102275227742816, 92.14786676770233, 0.2028184032973199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9247fc2b-d461-448f-ae2c-d6ef494d2038", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["register", 25, 8, 32.0, 897.9199999999998, 176, 2100, 906.0, 1590.6000000000001, 1962.2999999999997, 2100.0, 0.09955796264585241, 0.03115853112181912, 0.04491775267810919], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 384.99999999999994, 204, 1228, 209.0, 1215.2, 1228.0, 1228.0, 0.10395073957893836, 14.772882204321295, 0.23065861774561422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 110.66666666666666, 103, 163, 107.0, 147.40000000000006, 163.0, 163.0, 0.1143303575681933, 0.08876233815108757, 0.04064086929181871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 388.76190476190476, 204, 1316, 399.0, 616.6, 1246.099999999999, 1316.0, 0.15914275104768977, 9.301088612199429, 0.3559768167850133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 103.625, 100, 111, 103.0, 111.0, 111.0, 111.0, 0.0429777106847961, 0.03193949006946273, 0.021572796183579292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 128.125, 99, 304, 102.0, 304.0, 304.0, 304.0, 0.042977018039603326, 0.011499709905128233, 0.024510330600711273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 128.875, 100, 303, 103.5, 303.0, 303.0, 303.0, 0.04297724891885358, 0.011583711622659754, 0.025265921727685405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 102.75, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.042978172460661546, 0.011583960546037681, 0.025308435540799718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 105, 107, 106.0, 107.0, 107.0, 107.0, 0.05928385107896609, 0.017484104517429454, 0.03664714622361869], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1228.7090909090912, 798, 1952, 1203.0, 1649.8, 1739.1999999999998, 1952.0, 0.250900962547329, 300.16477849436615, 0.4954313928424798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acfd997f-961b-407c-b0ee-0c7fc1b45c5e", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 897.9199999999998, 176, 2100, 906.0, 1590.6000000000001, 1962.2999999999997, 2100.0, 0.09691612878215193, 0.030331719679789114, 0.04372583154038495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 102.5, 100, 106, 102.5, 106.0, 106.0, 106.0, 0.0343176787522092, 0.009249686851181386, 0.02020855496834194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 158.16666666666669, 99, 433, 103.0, 433.0, 433.0, 433.0, 0.0343176787522092, 0.009249686851181386, 0.020175041610185487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 275.25, 101, 1075, 104.0, 1053.7, 1075.0, 1075.0, 0.11153141933025383, 16.751078863169536, 0.06397082059241772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 202.5, 99, 606, 102.5, 605.7, 606.0, 606.0, 0.11153141933025383, 5.490707748180643, 0.06407973799410742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 100.83333333333334, 98, 103, 101.0, 103.0, 103.0, 103.0, 0.03431826761385085, 0.009182817701362435, 0.019572136998524316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 104.25, 101, 111, 104.0, 110.4, 111.0, 111.0, 0.11153141933025383, 0.08288614268586246, 0.05598354446850631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 104.66666666666666, 101, 111, 103.5, 111.0, 111.0, 111.0, 0.03431748246948604, 0.02550351968679578, 0.017225767567691234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adc425b6-6efb-4ef6-b839-2ca9ca3cbcdc", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 152.08333333333334, 100, 305, 103.0, 304.4, 305.0, 305.0, 0.11153038273509674, 0.05776199183969367, 0.06204603648902356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04439505-86ef-4977-aa67-7b2c1f67922b", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 106.0, 103, 113, 104.5, 113.0, 113.0, 113.0, 0.03328063898826857, 0.02619550295365671, 0.011830227140361095], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 484.40000000000003, 102, 1031, 415.0, 987.2, 1031.0, 1031.0, 0.09318969694710552, 0.017915961919583504, 0.06341874363203738], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/efef3460-0ba4-46c4-a5aa-c0d36d1b1d6c", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.808445411392405, 1.510581487341772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1353.5, 875, 2100, 1303.5, 1839.0, 2036.25, 2100.0, 0.10401768300611104, 0.05383727733714732, 0.04784407099206865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 264.33333333333337, 203, 544, 209.0, 544.0, 544.0, 544.0, 0.034297277367798286, 0.05315408123310145, 0.07713538064261666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dbdbbb7-ae65-4977-b4fa-bf9a9d8bda78", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7387123-f50c-447a-9395-45e01a7484d1", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.20390977708803612, 0.7781637979683973], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1046.220338983051, 525, 2569, 830.0, 1770.0, 1883.0, 2569.0, 0.27975343764817445, 86.1869610152916, 1.0167594609412043], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e405f9e9-ac8f-4a2b-8296-579a7aa59398", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 192.10909090909092, 100, 565, 105.0, 411.2, 414.2, 565.0, 0.25225192170100347, 0.18746456290474967, 0.12193818480663743], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 639.9454545454547, 489, 907, 603.0, 812.4, 905.2, 907.0, 0.2518257365902795, 74.0451279589524, 0.1266506390078066], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 177.8181818181818, 98, 409, 106.0, 309.4, 339.99999999999966, 409.0, 0.25264937319987324, 0.4470709611700881, 0.12287049595071958], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1035.0, 693, 1507, 1007.0, 1274.8, 1330.1999999999998, 1507.0, 0.25141133179439124, 226.22035828257492, 0.12619670365460656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 136.04761904761904, 102, 306, 108.0, 300.4, 305.5, 306.0, 0.1452462962194464, 0.1085091959061294, 0.05163051935925634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 166.32947976878617, 101, 2153, 109.0, 279.6, 331.59999999999997, 940.1399999999851, 0.7464554154693176, 1.6076019998425108, 0.35895188275040774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 108.375, 105, 120, 105.5, 120.0, 120.0, 120.0, 0.044345898004434586, 0.03434208702882483, 0.015763580931263857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f122df77-762f-49bb-aad0-24a80202c6fd", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 132.73333333333335, 99, 317, 106.0, 306.8, 317.0, 317.0, 0.09430937246543562, 0.07653426613161816, 0.033524034743572816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc43900a-c7eb-46b1-8fb4-eaa06691b62f", 3, 0, 0.0, 352.3333333333333, 208, 441, 408.0, 441.0, 441.0, 441.0, 0.08406186953597848, 0.038035806853844424, 0.05390686295113203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dbdbbb7-ae65-4977-b4fa-bf9a9d8bda78", 3, 0, 0.0, 287.6666666666667, 214, 400, 249.0, 400.0, 400.0, 400.0, 0.07025103034844511, 0.03178676177875609, 0.04505030266485575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 234.875, 205, 408, 210.5, 408.0, 408.0, 408.0, 0.04295325075570875, 0.06656914936456035, 0.09660286766640358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7e31dc8-4caf-4988-848e-09102a7059b5", 3, 0, 0.0, 912.3333333333334, 342, 1959, 436.0, 1959.0, 1959.0, 1959.0, 0.03337004037774886, 0.027819229624809514, 0.021399407403699625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 414.5833333333333, 204, 1178, 213.5, 1157.0, 1178.0, 1178.0, 0.11142475115138908, 22.36102881606559, 0.2458453656588917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c68a445-70b2-44cb-9a67-07915e43930f", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 121.94736842105263, 103, 298, 108.0, 138.0, 298.0, 298.0, 0.08742183797512618, 0.07248158246179896, 0.03107573146772064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aaab493-5db4-49a1-98c4-ccae646e09a0", 1, 0, 0.0, 899.0, 899, 899, 899.0, 899.0, 899.0, 899.0, 1.1123470522803114, 0.20096113737486096, 0.7669111512791991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 109.68750000000001, 102, 128, 107.0, 120.30000000000001, 128.0, 128.0, 0.07695748579893895, 0.05974726680679342, 0.027355981280091576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6661d257-d1cc-4565-b152-8d990a5b3b26", 3, 0, 0.0, 329.0, 183, 528, 276.0, 528.0, 528.0, 528.0, 0.0319976108450569, 0.026195960701600945, 0.020519301225508494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 131.28571428571428, 99, 315, 102.0, 306.6, 314.4, 315.0, 0.15926948396687193, 0.11836335673709916, 0.07994581519430877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 177.5238095238095, 99, 304, 104.0, 304.0, 304.0, 304.0, 0.159264652348016, 0.05400659621101808, 0.0901936819333212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9247fc2b-d461-448f-ae2c-d6ef494d2038", 3, 0, 0.0, 340.0, 188, 610, 222.0, 610.0, 610.0, 610.0, 0.07397908857762873, 0.033473611042611956, 0.04744101708916946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 193.04761904761904, 98, 1213, 102.0, 304.8, 1122.1999999999987, 1213.0, 0.15926948396687193, 6.865215414347147, 0.09298126403088311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 211.47619047619045, 99, 901, 102.0, 390.20000000000005, 851.9999999999993, 901.0, 0.15926827603467497, 2.2708912813891224, 0.09313609426785889], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6074411541381929], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15186028853454822], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15186028853454822], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1389521640091116], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
