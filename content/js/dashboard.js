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

    var data = {"OkPercent": 98.76923076923077, "KoPercent": 1.2307692307692308};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7670191672174488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86776ce6-e209-4455-8608-72d3aff4574f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc2a44c7-880a-40bf-9eed-8d827bf5aa63"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c06d270-f5ab-4064-aafc-3e6e864908e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7891eef0-8c0a-4349-826d-b57dfeea45ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1cf064a-1f43-4b63-8033-4950c8a99c72"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecf35b60-a863-4deb-882c-ebd17d28ffcb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ff1457b-91e9-428a-85ce-3196b82f8725"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c06d270-f5ab-4064-aafc-3e6e864908e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f595f01f-0426-4405-8c9c-f70b7e5df376"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43cbfe57-3da2-4a37-b136-bc973b35f6ee"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c1cf064a-1f43-4b63-8033-4950c8a99c72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afe9e6f6-bd0f-43e5-a6d3-5a281d3b7bc4"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0086b74-363f-4698-b17c-0dcbbb51daf1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa1f6245-46e0-4b27-89b1-bfd0ba397c7a"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc2a44c7-880a-40bf-9eed-8d827bf5aa63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecf35b60-a863-4deb-882c-ebd17d28ffcb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af1690b8-91d8-4367-8261-b89371c1c768"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afe9e6f6-bd0f-43e5-a6d3-5a281d3b7bc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e43c07a-a48c-40ff-84ee-35fa282cc4b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.047619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86776ce6-e209-4455-8608-72d3aff4574f"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f595f01f-0426-4405-8c9c-f70b7e5df376"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa12ef34-9cd4-49dc-b042-0abad5659c8e"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7891eef0-8c0a-4349-826d-b57dfeea45ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9367816091954023, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e43c07a-a48c-40ff-84ee-35fa282cc4b9"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43cbfe57-3da2-4a37-b136-bc973b35f6ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2404d6e2-de10-4765-96cd-e64b24275e4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3315dd97-1021-4b60-8d4c-6eb7e4f6bdf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aa1f6245-46e0-4b27-89b1-bfd0ba397c7a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0086b74-363f-4698-b17c-0dcbbb51daf1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 16, 1.2307692307692308, 399.303076923077, 90, 3672, 125.0, 1085.9, 1310.0, 2627.83, 5.068245880100897, 712.2351833913094, 3.699099917299872], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1665.7678571428573, 1187, 2181, 1646.5, 2010.5, 2075.25, 2181.0, 0.2514943705679731, 302.6314159834777, 1.2365958552829535], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 949.9285714285716, 104, 3388, 660.5, 2450.5, 3388.0, 3388.0, 0.08141712318410738, 0.01537361554543657, 0.0550599197314398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 949.9285714285716, 104, 3388, 660.5, 2450.5, 3388.0, 3388.0, 0.08216107091087284, 0.0155140917240327, 0.05556302891189399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 129.53846153846155, 92, 302, 101.0, 296.4, 302.0, 302.0, 0.0773938513561784, 0.020708901632414924, 0.044138680851570494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86776ce6-e209-4455-8608-72d3aff4574f", 3, 0, 0.0, 574.0, 208, 1273, 241.0, 1273.0, 1273.0, 1273.0, 0.05116398055768739, 0.033493087533043406, 0.03281023492794406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 100.15384615384616, 97, 105, 100.0, 103.8, 105.0, 105.0, 0.07739016549589237, 0.0575135897874747, 0.038846235414930354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 143.84615384615387, 93, 303, 101.0, 298.2, 303.0, 303.0, 0.07739016549589237, 0.02085906804381474, 0.045572529095725685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 129.99999999999997, 95, 306, 100.0, 298.4, 306.0, 306.0, 0.07739154765235717, 0.020859440578174394, 0.04549776531906154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc2a44c7-880a-40bf-9eed-8d827bf5aa63", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 293.42857142857144, 99, 755, 242.5, 625.5, 755.0, 755.0, 0.08159982281181333, 0.1670474051256346, 0.052747318498679835], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c06d270-f5ab-4064-aafc-3e6e864908e7", 1, 0, 0.0, 1269.0, 1269, 1269, 1269.0, 1269.0, 1269.0, 1269.0, 0.7880220646178093, 0.14236726753349094, 0.5433042750197006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.375, 92, 313, 102.5, 170.90000000000015, 313.0, 313.0, 0.09292870625816757, 0.06906127486568897, 0.04664585450849426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7891eef0-8c0a-4349-826d-b57dfeea45ac", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 766.0, 584, 891, 794.5, 891.0, 891.0, 891.0, 0.0174769413604925, 5.138801049053406, 0.00996731811965588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 160.87500000000003, 91, 304, 99.5, 300.5, 304.0, 304.0, 0.09293032548846501, 0.04231324634667658, 0.052023739342053295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1cf064a-1f43-4b63-8033-4950c8a99c72", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 883.75, 686, 1085, 882.0, 1085.0, 1085.0, 1085.0, 0.017438616071428572, 15.69129739488874, 0.009928430829729353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 244.0, 98, 306, 286.0, 306.0, 306.0, 306.0, 0.017499803127214816, 0.030966448502454346, 0.00968983239563555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 102.54545454545455, 98, 117, 101.0, 114.4, 117.0, 117.0, 0.05571736102317335, 0.04140714036976067, 0.027967503482335062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 118.45454545454545, 96, 303, 100.0, 263.0000000000001, 303.0, 303.0, 0.05572187691543952, 0.022518286906878612, 0.03135344956410296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 203.8181818181818, 96, 822, 103.0, 718.4000000000003, 822.0, 822.0, 0.05572272372673576, 4.571781355746532, 0.03232353309929789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 180.45454545454547, 98, 772, 102.0, 678.2000000000003, 772.0, 772.0, 0.05572159465072691, 1.503107824451649, 0.0323772937667798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 152.5, 98, 304, 104.0, 304.0, 304.0, 304.0, 0.01751305817400099, 0.013015075459389406, 0.009833992627002509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 603.5263157894736, 96, 1315, 294.0, 1281.0, 1315.0, 1315.0, 0.08462347009673798, 36.08037952652055, 0.04630455708521138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 244.75, 98, 1084, 101.5, 1044.8, 1084.0, 1084.0, 0.09293086524443722, 10.474336288486446, 0.053634903671349994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 420.05263157894746, 95, 863, 275.0, 824.0, 863.0, 863.0, 0.0846230931967487, 11.798214633671083, 0.04638699059124819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 239.06249999999997, 92, 797, 101.5, 773.9, 797.0, 797.0, 0.09293032548846501, 3.4374918322956116, 0.05372534442301884], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 618.3846153846152, 124, 1269, 585.0, 1263.4, 1269.0, 1269.0, 0.0885028048581232, 0.01676713295163662, 0.06053320599708621], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 307.6363636363636, 198, 923, 207.0, 819.6000000000004, 923.0, 923.0, 0.055688025555741184, 6.135026771385467, 0.1239483743526267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecf35b60-a863-4deb-882c-ebd17d28ffcb", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 925.0952380952381, 387, 1855, 789.0, 1704.0, 1840.6, 1855.0, 0.08941801645291503, 0.054925715184456596, 0.04043021642353482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 102.84210526315789, 96, 137, 101.0, 109.0, 137.0, 137.0, 0.08462233940684194, 0.0628882815318425, 0.04247644771007496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff1457b-91e9-428a-85ce-3196b82f8725", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.7826861213235294, 1.4624502144607845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 151.89473684210526, 97, 304, 102.0, 301.0, 304.0, 304.0, 0.08462196251692439, 0.08284740655953823, 0.04489452596112734], "isController": false}, {"data": ["login", 21, 0, 0.0, 3923.3809523809523, 2246, 5525, 3505.0, 5453.2, 5519.4, 5525.0, 0.09080806202623057, 20.81920932393398, 0.16569177500572954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c06d270-f5ab-4064-aafc-3e6e864908e7", 3, 0, 0.0, 415.33333333333337, 204, 838, 204.0, 838.0, 838.0, 838.0, 0.01883629377083765, 0.02596735160139891, 0.012079263909033258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 108.9375, 99, 143, 105.5, 126.90000000000002, 143.0, 143.0, 0.0924347901441405, 0.07483246194286375, 0.032857679309049946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f595f01f-0426-4405-8c9c-f70b7e5df376", 1, 0, 0.0, 1255.0, 1255, 1255, 1255.0, 1255.0, 1255.0, 1255.0, 0.7968127490039841, 0.1439554282868526, 0.5493650398406374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43cbfe57-3da2-4a37-b136-bc973b35f6ee", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1cf064a-1f43-4b63-8033-4950c8a99c72", 3, 0, 0.0, 1272.6666666666667, 510, 2553, 755.0, 2553.0, 2553.0, 2553.0, 0.016729215344036312, 0.02306257388736777, 0.01072804499601287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afe9e6f6-bd0f-43e5-a6d3-5a281d3b7bc4", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 718.1052631578948, 197, 1417, 397.0, 1408.0, 1417.0, 1417.0, 0.08458353737256823, 48.00172262442683, 0.17997912539509417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0086b74-363f-4698-b17c-0dcbbb51daf1", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 746.0, 99, 1196, 948.5, 1196.0, 1196.0, 1196.0, 0.026145271845464016, 20.854888430499333, 0.045077614690592495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 277.7692307692308, 199, 407, 205.0, 406.6, 407.0, 407.0, 0.0773432015325853, 0.11986685628145786, 0.17394667297807023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa1f6245-46e0-4b27-89b1-bfd0ba397c7a", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1658.6521739130433, 258, 3454, 1589.0, 2777.8, 3327.3999999999983, 3454.0, 0.09173104457729936, 0.029039855144715694, 0.041386467377648735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc2a44c7-880a-40bf-9eed-8d827bf5aa63", 3, 0, 0.0, 494.3333333333333, 213, 729, 541.0, 729.0, 729.0, 729.0, 0.07241304400299307, 0.03276501665500012, 0.04643675022327355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 118.76470588235294, 98, 310, 107.0, 158.79999999999987, 310.0, 310.0, 0.083407336901859, 0.06475471956736124, 0.029648701789332692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 439.37500000000006, 200, 1342, 395.0, 1230.0, 1342.0, 1342.0, 0.09287530329591233, 14.014840185547442, 0.20590835674564936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecf35b60-a863-4deb-882c-ebd17d28ffcb", 3, 0, 0.0, 423.33333333333337, 224, 804, 242.0, 804.0, 804.0, 804.0, 0.06849784231796698, 0.03175160399114095, 0.043926025184373364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 436.125, 201, 1213, 399.0, 1055.5000000000002, 1213.0, 1213.0, 0.07781230698900414, 11.74184103006473, 0.17251307611502606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 98.875, 95, 102, 99.0, 102.0, 102.0, 102.0, 0.044329434190184355, 0.0329440424011038, 0.02225129802124488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 124.375, 91, 304, 100.0, 304.0, 304.0, 304.0, 0.04433066241092307, 0.011861915527922777, 0.02528233090622957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 129.125, 93, 301, 101.0, 301.0, 301.0, 301.0, 0.04432845166259399, 0.011947902987183536, 0.02606028115320467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 127.125, 93, 304, 100.0, 304.0, 304.0, 304.0, 0.044280116013903956, 0.01193487501937255, 0.026075107379281332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 2.3784022177419355, 4.985194052419355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af1690b8-91d8-4367-8261-b89371c1c768", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1143.7142857142856, 735, 1753, 1124.0, 1535.1000000000004, 1627.2499999999998, 1753.0, 0.24339571797390452, 291.1858967393666, 0.48061146654612785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1658.6521739130433, 258, 3454, 1589.0, 2777.8, 3327.3999999999983, 3454.0, 0.08984620673221534, 0.02844316055517143, 0.040536081553011215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afe9e6f6-bd0f-43e5-a6d3-5a281d3b7bc4", 3, 0, 0.0, 411.66666666666663, 244, 694, 297.0, 694.0, 694.0, 694.0, 0.026636123911248435, 0.02671415943051967, 0.017081108107148246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 174.80000000000004, 95, 435, 102.0, 356.40000000000003, 435.0, 435.0, 0.07521775540188846, 0.020273535635665252, 0.044293268073573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 136.80000000000004, 92, 293, 100.0, 288.8, 293.0, 293.0, 0.07529477906001997, 0.02029429591852101, 0.04426509472083205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 216.47058823529412, 92, 1115, 101.0, 1056.6, 1115.0, 1115.0, 0.08281936609082849, 8.786874028699346, 0.04785140074342561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 170.7058823529412, 90, 594, 101.0, 589.2, 594.0, 594.0, 0.08281573498964803, 2.8844690049933015, 0.04793017750578492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e43c07a-a48c-40ff-84ee-35fa282cc4b9", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 104.05882352941175, 93, 121, 103.0, 112.19999999999999, 121.0, 121.0, 0.08281896261941764, 0.06154807671228205, 0.04157123709607487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 126.66666666666669, 92, 304, 102.0, 297.4, 304.0, 304.0, 0.07529402316044152, 0.020147033540977518, 0.04294112258368931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 147.1176470588235, 92, 330, 102.0, 302.0, 330.0, 330.0, 0.08281533155361562, 0.03679307067070675, 0.04641236067538338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 141.06666666666666, 93, 299, 103.0, 297.8, 299.0, 299.0, 0.07529364521634374, 0.0559555312594117, 0.037793880508985044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 130.46666666666667, 99, 315, 105.0, 284.40000000000003, 315.0, 315.0, 0.07342359540661987, 0.05779240029075743, 0.026099793679696906], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 716.6923076923077, 100, 1800, 593.0, 1589.1999999999998, 1800.0, 1800.0, 0.08531807233659948, 0.01598432034310991, 0.058066536611297424], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2322.3333333333335, 1279, 3672, 2200.0, 3514.6, 3658.2, 3672.0, 0.09170545953169079, 0.0474647397966759, 0.042180929140064806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86776ce6-e209-4455-8608-72d3aff4574f", 1, 0, 0.0, 1031.0, 1031, 1031, 1031.0, 1031.0, 1031.0, 1031.0, 0.9699321047526673, 0.17523187439379245, 0.6687227206595538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 331.9333333333333, 196, 602, 207.0, 598.4, 602.0, 602.0, 0.07517892584350755, 0.11651265167348289, 0.16907916622812294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f595f01f-0426-4405-8c9c-f70b7e5df376", 3, 0, 0.0, 813.0, 234, 1577, 628.0, 1577.0, 1577.0, 1577.0, 0.01967897039626887, 0.023259876793246176, 0.012619652239794815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa12ef34-9cd4-49dc-b042-0abad5659c8e", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1158.0508474576275, 527, 3454, 934.0, 1890.0, 1978.0, 3454.0, 0.2758440125485649, 90.54721706556906, 1.002253943634315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7891eef0-8c0a-4349-826d-b57dfeea45ac", 3, 0, 0.0, 902.3333333333333, 411, 1800, 496.0, 1800.0, 1800.0, 1800.0, 0.0169776404475306, 0.02340504794768623, 0.010887354063032319], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 176.6785714285714, 97, 438, 103.0, 403.6, 418.0, 438.0, 0.24456711620431837, 0.1817534916323108, 0.11822336183704843], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 627.6428571428569, 450, 916, 589.0, 838.9000000000002, 890.4, 916.0, 0.24440167415146793, 71.86220709986864, 0.12291685760547459], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 150.3035714285715, 91, 428, 106.0, 304.3, 307.3, 428.0, 0.24473919979022354, 0.433073662128794, 0.11902355614797981], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 965.2678571428571, 631, 1314, 973.0, 1203.6, 1224.9499999999998, 1314.0, 0.24387800873605867, 219.44186095251783, 0.12241532860384195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 114.6875, 103, 184, 109.0, 139.90000000000003, 184.0, 184.0, 0.07810364353497092, 0.05834891338305932, 0.02776340453782169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 205.1379310344828, 93, 2740, 109.0, 377.0, 497.75, 1630.75, 0.7235528942115769, 1.5498137838905524, 0.3481440439433633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 142.75, 102, 305, 117.0, 305.0, 305.0, 305.0, 0.04535378789167248, 0.03512261113095339, 0.016121854289617953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 131.23076923076925, 97, 306, 106.0, 253.59999999999997, 306.0, 306.0, 0.07272361111888072, 0.05901691488260732, 0.025850971139914636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 255.625, 199, 404, 204.5, 404.0, 404.0, 404.0, 0.04425464120549643, 0.06858605038390901, 0.09952972528931472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e43c07a-a48c-40ff-84ee-35fa282cc4b9", 3, 0, 0.0, 379.0, 262, 528, 347.0, 528.0, 528.0, 528.0, 0.04080022848127949, 0.026496242128955922, 0.02616420901957051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 368.0, 196, 1219, 214.0, 1159.8, 1219.0, 1219.0, 0.08277742610897404, 11.763852475105907, 0.1836766795904952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43cbfe57-3da2-4a37-b136-bc973b35f6ee", 3, 0, 0.0, 433.0, 255, 541, 503.0, 541.0, 541.0, 541.0, 0.020942262183161028, 0.024753044917662004, 0.013429770996363027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 104.81818181818181, 98, 108, 106.0, 108.0, 108.0, 108.0, 0.05431267312164558, 0.0450307221487081, 0.01930645802370995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 125.47368421052632, 95, 312, 106.0, 278.0, 312.0, 312.0, 0.0864815657715066, 0.06714144998862084, 0.03074149408284024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2404d6e2-de10-4765-96cd-e64b24275e4a", 2, 0, 0.0, 311.5, 221, 402, 311.5, 402.0, 402.0, 402.0, 0.03939179075080754, 0.03319835490033877, 0.024485229309461908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3315dd97-1021-4b60-8d4c-6eb7e4f6bdf0", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.5880956491712707, 1.0988576197053406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 109.06249999999999, 96, 196, 101.0, 165.20000000000005, 196.0, 196.0, 0.07785092520958929, 0.05785600984814204, 0.039077515193094624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 176.43750000000003, 92, 317, 104.0, 314.2, 317.0, 317.0, 0.07785130400934215, 0.03544743212339432, 0.043582285179057996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa1f6245-46e0-4b27-89b1-bfd0ba397c7a", 3, 0, 0.0, 552.6666666666666, 312, 753, 593.0, 753.0, 753.0, 753.0, 0.02946375957572186, 0.024562724047338443, 0.018894403113337264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 282.5625, 96, 1116, 186.5, 955.7000000000002, 1116.0, 1116.0, 0.07785092520958929, 8.774660268901961, 0.04493153984264382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0086b74-363f-4698-b17c-0dcbbb51daf1", 3, 0, 0.0, 370.3333333333333, 263, 505, 343.0, 505.0, 505.0, 505.0, 0.08123036932741254, 0.03675462674645294, 0.05209108970540453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 273.75, 93, 799, 296.0, 794.8, 799.0, 799.0, 0.07785206161990676, 2.8797469990463123, 0.0450082231240086], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.38461538461538464], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07692307692307693], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07692307692307693], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6923076923076923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
