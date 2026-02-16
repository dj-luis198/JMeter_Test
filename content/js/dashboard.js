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

    var data = {"OkPercent": 67.04, "KoPercent": 32.96};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4840989399293286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f845b94-b5bb-4d54-b8ea-61776e19eecd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d0f3b80-5a66-4d40-b3d9-08512b2df750"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62040041-6535-494b-a64e-086191aa3f14"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9be673f0-93f7-45f8-8048-901c520f974f"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5377c9fa-952e-416c-ae6d-67507722e7a0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f845b94-b5bb-4d54-b8ea-61776e19eecd"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63bc0cd5-d2b2-4e1e-b496-79c794da2be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/044a22f8-8492-448b-88bf-1f868eed526d"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0e39fcc-179a-4e5d-8504-99901eb48dcb"], "isController": false}, {"data": [0.9162011173184358, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7cea625-2467-48e5-831e-2d9cdc446875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7cea625-2467-48e5-831e-2d9cdc446875"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63bc0cd5-d2b2-4e1e-b496-79c794da2be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0e39fcc-179a-4e5d-8504-99901eb48dcb"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeb7cbbf-e0ea-4ee6-ac8b-a814bab6b070"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fabe10a7-2d97-4900-98a8-ef5fab64617d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8fd08ea8-12fa-46c8-a0b7-8d63c5a860f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fabe10a7-2d97-4900-98a8-ef5fab64617d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cd97c49-e393-4d3d-8f6c-d7063bcfc72c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9be673f0-93f7-45f8-8048-901c520f974f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3cd97c49-e393-4d3d-8f6c-d7063bcfc72c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fd08ea8-12fa-46c8-a0b7-8d63c5a860f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/62040041-6535-494b-a64e-086191aa3f14"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b8dba1b-e28b-4f76-b03c-fc362bb0dee3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47650850-e764-4228-b1fd-f454d252c4cb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d0f3b80-5a66-4d40-b3d9-08512b2df750"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66b68a96-e80f-4dbb-a33e-76a166aa6647"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b887c5a-a702-4899-b681-772c0ce00b7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeb7cbbf-e0ea-4ee6-ac8b-a814bab6b070"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b887c5a-a702-4899-b681-772c0ce00b7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66b68a96-e80f-4dbb-a33e-76a166aa6647"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 625, 206, 32.96, 353.4495999999998, 133, 3154, 153.0, 710.1999999999998, 1353.3999999999992, 2425.6600000000008, 2.4479468580112487, 2.5655898291235175, 1.1731058582795437], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 800.8813559322032, 565, 1096, 874.0, 995.0, 1025.0, 1096.0, 0.2511546729668178, 1.6160100461869187, 0.42161609651363263], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 198.1578947368421, 141, 453, 151.0, 436.0, 453.0, 453.0, 0.08997703217862808, 0.06985521541211849, 0.0319840231572467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 195.29411764705884, 139, 430, 148.0, 423.6, 430.0, 430.0, 0.08743012019070052, 0.04345891716510407, 0.04388582204884772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f845b94-b5bb-4d54-b8ea-61776e19eecd", 3, 0, 0.0, 424.6666666666667, 240, 571, 463.0, 571.0, 571.0, 571.0, 0.02199445739673602, 0.022058894283640523, 0.014104518577985016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 188.13333333333335, 140, 446, 149.0, 444.8, 446.0, 446.0, 0.12266727727711356, 0.060974261849658984, 0.06157322316448864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d0f3b80-5a66-4d40-b3d9-08512b2df750", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 151.0, 147, 155, 151.0, 155.0, 155.0, 155.0, 0.028969972623375872, 0.00854387864478468, 0.01790819596737981], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 256.7966101694915, 139, 599, 150.0, 555.0, 578.0, 599.0, 0.25368924357607237, 0.1261013915822469, 0.1226329839552303], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 446.66666666666663, 149, 737, 448.0, 639.2, 737.0, 737.0, 0.08966411821317345, 0.017565060657775973, 0.060371504593791654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 446.66666666666663, 149, 737, 448.0, 639.2, 737.0, 737.0, 0.08878576586601636, 0.01739299280539344, 0.05978010355379826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1438.3913043478262, 553, 3154, 1258.0, 2464.2, 3017.399999999998, 3154.0, 0.0924637984128388, 0.029130493555675267, 0.041717065299542506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62040041-6535-494b-a64e-086191aa3f14", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9be673f0-93f7-45f8-8048-901c520f974f", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 542.0000000000001, 145, 1968, 484.0, 1255.0, 1968.0, 1968.0, 0.08515504300329672, 0.01923353998637519, 0.056928427186355726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 157.85714285714283, 145, 194, 151.0, 194.0, 194.0, 194.0, 0.05733334425397034, 0.04512761276240243, 0.020380212215278515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1561.4545454545453, 855, 2900, 1392.0, 2501.2, 2842.6999999999994, 2900.0, 0.10162789408525656, 0.052600374868345685, 0.046744861439605316], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 466.37500000000006, 146, 2080, 235.5, 1871.4, 2080.0, 2080.0, 0.09062023889760479, 0.1804440108517736, 0.057622170949416913], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5377c9fa-952e-416c-ae6d-67507722e7a0", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 147.42857142857144, 145, 153, 146.0, 153.0, 153.0, 153.0, 0.05214036185411127, 0.02591742596068617, 0.02617201757130195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f845b94-b5bb-4d54-b8ea-61776e19eecd", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 915.7000000000002, 596, 2519, 836.0, 1172.8999999999999, 1805.299999999998, 2519.0, 0.27505776213004735, 0.8914262131766421, 0.5374728953496901], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63bc0cd5-d2b2-4e1e-b496-79c794da2be9", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/044a22f8-8492-448b-88bf-1f868eed526d", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 215.0666666666667, 141, 511, 154.0, 472.0, 511.0, 511.0, 0.12202264740335805, 0.09115949732770402, 0.04337523794416244], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 526.9333333333333, 147, 1719, 488.0, 1124.4000000000003, 1719.0, 1719.0, 0.08894475937477764, 0.017424139385332417, 0.06047780383529802], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d0e39fcc-179a-4e5d-8504-99901eb48dcb", 3, 0, 0.0, 493.3333333333333, 412, 542, 526.0, 542.0, 542.0, 542.0, 0.0764019762644527, 0.03541549941425152, 0.04899475691437885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 245.0893854748606, 139, 2069, 154.0, 447.0, 536.0, 1876.1999999999973, 0.742492118798739, 1.624408099749046, 0.35561814283640286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 171.7692307692308, 145, 414, 151.0, 311.5999999999999, 414.0, 414.0, 0.07330220808805286, 0.05676626075568938, 0.026056644281300043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7cea625-2467-48e5-831e-2d9cdc446875", 3, 0, 0.0, 391.3333333333333, 228, 541, 405.0, 541.0, 541.0, 541.0, 0.04852249017419574, 0.031195285837902535, 0.031116310430717973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7cea625-2467-48e5-831e-2d9cdc446875", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 164.29411764705878, 140, 443, 146.0, 214.1999999999998, 443.0, 443.0, 0.08557678754807402, 0.04253768052926726, 0.04295553593721684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 151.93333333333337, 147, 161, 152.0, 158.6, 161.0, 161.0, 0.09775171065493646, 0.07932780425219942, 0.03474767839687195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63bc0cd5-d2b2-4e1e-b496-79c794da2be9", 3, 0, 0.0, 315.3333333333333, 225, 490, 231.0, 490.0, 490.0, 490.0, 0.02633635030857424, 0.03112867446954201, 0.016888870477829183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0e39fcc-179a-4e5d-8504-99901eb48dcb", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 628.4545454545455, 207, 1393, 613.5, 896.9, 1319.349999999999, 1393.0, 0.10062248729641098, 0.061808148935002444, 0.04549630040843582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeb7cbbf-e0ea-4ee6-ac8b-a814bab6b070", 3, 0, 0.0, 335.3333333333333, 242, 478, 286.0, 478.0, 478.0, 478.0, 0.018695199695891417, 0.02577284202867844, 0.01198878365914912], "isController": false}, {"data": ["login", 22, 5, 22.727272727272727, 2544.318181818182, 1650, 4061, 2497.5, 3547.1, 3984.949999999999, 4061.0, 0.10113315098719745, 0.15084677465695176, 0.15178053244305514], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fabe10a7-2d97-4900-98a8-ef5fab64617d", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, 100.0, 146.92307692307693, 134, 152, 149.0, 151.2, 152.0, 152.0, 0.06857444283265199, 0.03408631972833971, 0.03442115587498352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 205.52941176470588, 142, 467, 151.0, 451.0, 467.0, 467.0, 0.09082991830650289, 0.073533205347745, 0.0322871975230147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, 100.0, 176.63157894736844, 141, 439, 148.0, 413.0, 439.0, 439.0, 0.08812738581705683, 0.0438055072078925, 0.04423581670895235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fd08ea8-12fa-46c8-a0b7-8d63c5a860f5", 3, 0, 0.0, 815.0, 235, 1684, 526.0, 1684.0, 1684.0, 1684.0, 0.018255837303977947, 0.021577781657143205, 0.01170703108360565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fabe10a7-2d97-4900-98a8-ef5fab64617d", 3, 0, 0.0, 398.6666666666667, 363, 421, 412.0, 421.0, 421.0, 421.0, 0.03995737879595098, 0.033310822622535964, 0.025623709709643047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cd97c49-e393-4d3d-8f6c-d7063bcfc72c", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9be673f0-93f7-45f8-8048-901c520f974f", 3, 0, 0.0, 330.6666666666667, 236, 510, 246.0, 510.0, 510.0, 510.0, 0.07542236524537409, 0.03412665614943684, 0.04836655583769107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cd97c49-e393-4d3d-8f6c-d7063bcfc72c", 3, 0, 0.0, 812.6666666666666, 225, 1968, 245.0, 1968.0, 1968.0, 1968.0, 0.026084461486292617, 0.030830950409091305, 0.016727340210936345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fd08ea8-12fa-46c8-a0b7-8d63c5a860f5", 1, 0, 0.0, 1719.0, 1719, 1719, 1719.0, 1719.0, 1719.0, 1719.0, 0.5817335660267597, 0.1050983493310064, 0.4010780250145433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 183.76470588235298, 141, 452, 150.0, 439.2, 452.0, 452.0, 0.09022109475337799, 0.07480245063048624, 0.03207077977561483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62040041-6535-494b-a64e-086191aa3f14", 3, 0, 0.0, 818.0, 257, 1782, 415.0, 1782.0, 1782.0, 1782.0, 0.019336998768877744, 0.026657613862694416, 0.012400354028219127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 179.81249999999997, 133, 439, 145.0, 420.1, 439.0, 439.0, 0.07578305206769322, 0.037669505373492035, 0.03803953980741632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 167.62500000000003, 135, 445, 150.0, 253.2000000000002, 445.0, 445.0, 0.07683073229291716, 0.059648859543817524, 0.0273109243697479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b8dba1b-e28b-4f76-b03c-fc362bb0dee3", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47650850-e764-4228-b1fd-f454d252c4cb", 2, 0, 0.0, 304.0, 272, 336, 304.0, 336.0, 336.0, 336.0, 0.04332661770758866, 0.03651452254067286, 0.026931047041875177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d0f3b80-5a66-4d40-b3d9-08512b2df750", 3, 0, 0.0, 918.6666666666666, 242, 2080, 434.0, 2080.0, 2080.0, 2080.0, 0.030260848514192338, 0.030546514076338033, 0.019405557152655892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 210.26666666666665, 144, 476, 150.0, 458.6, 476.0, 476.0, 0.08962126055290343, 0.04454806798967563, 0.0449856718009691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 210.22222222222223, 142, 439, 149.0, 439.0, 439.0, 439.0, 0.07364252282918207, 0.036605511835989916, 0.04191135332455078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66b68a96-e80f-4dbb-a33e-76a166aa6647", 2, 0, 0.0, 253.5, 223, 284, 253.5, 284.0, 284.0, 284.0, 0.04409657149156653, 0.03892900451989858, 0.027409636478888767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b887c5a-a702-4899-b681-772c0ce00b7e", 3, 0, 0.0, 318.6666666666667, 216, 505, 235.0, 505.0, 505.0, 505.0, 0.045606567345697784, 0.029320628420492552, 0.029246398981453328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeb7cbbf-e0ea-4ee6-ac8b-a814bab6b070", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b887c5a-a702-4899-b681-772c0ce00b7e", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66b68a96-e80f-4dbb-a33e-76a166aa6647", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1438.3913043478262, 553, 3154, 1258.0, 2464.2, 3017.399999999998, 3154.0, 0.09547926439453693, 0.03008050873842833, 0.043077558740503966], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.912621359223301, 0.96], "isController": false}, {"data": ["401/Unauthorized", 13, 6.310679611650485, 2.08], "isController": false}, {"data": ["404/Not Found", 187, 90.77669902912622, 29.92], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 625, 206, "404/Not Found", 187, "401/Unauthorized", 13, "406/Not Acceptable", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
