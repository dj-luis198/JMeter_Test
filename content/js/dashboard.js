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

    var data = {"OkPercent": 96.78899082568807, "KoPercent": 3.2110091743119265};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7969361147327249, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82d6a0df-f23e-48e2-a151-9b8d3540615c"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=550d9108-d521-465e-97d6-f6a62890a5df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f082f8d-9c70-46e7-b438-413da8521f0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1766fd5-2782-4744-8268-1c4d6ffe8475"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/922e39cd-b3a1-4bc8-b475-dd4d1be2b541"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79ff58d8-5ab5-48b6-91de-f6b6e776e558"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fce41b83-74b3-417a-9524-e508ea84d985"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/692496af-85c9-49a1-82b1-ca62e049d3ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99accf58-3ea9-435a-ab40-35730f08e92d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac1df290-dc35-4822-afa0-6da6fbe5ec3a"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=175153f5-9d48-4ba1-8490-a6fea38f9d41"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f53f811c-87f5-4add-9d8f-b4e7e4682f99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dde0fab-4547-44db-82e1-f4ecc25b7a4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f082f8d-9c70-46e7-b438-413da8521f0a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=922e39cd-b3a1-4bc8-b475-dd4d1be2b541"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8454545454545455, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e9edce1-617b-49d1-96f0-6ac13b70651f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82d6a0df-f23e-48e2-a151-9b8d3540615c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1766fd5-2782-4744-8268-1c4d6ffe8475"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fce41b83-74b3-417a-9524-e508ea84d985"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/550d9108-d521-465e-97d6-f6a62890a5df"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79ff58d8-5ab5-48b6-91de-f6b6e776e558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/175153f5-9d48-4ba1-8490-a6fea38f9d41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dde0fab-4547-44db-82e1-f4ecc25b7a4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/99accf58-3ea9-435a-ab40-35730f08e92d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f53f811c-87f5-4add-9d8f-b4e7e4682f99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=692496af-85c9-49a1-82b1-ca62e049d3ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac1df290-dc35-4822-afa0-6da6fbe5ec3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f6e6b19-9e21-4cf8-9a61-58f8ac8462f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 42, 3.2110091743119265, 287.6888379204896, 81, 2207, 98.0, 740.0, 849.6499999999999, 1405.680000000004, 5.183174496245369, 733.4109872501041, 3.7876562159457907], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1231.5818181818183, 997, 1597, 1194.0, 1459.0, 1475.1999999999998, 1597.0, 0.24724657226342997, 297.5207428986851, 1.2157094642054396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82d6a0df-f23e-48e2-a151-9b8d3540615c", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 522.764705882353, 88, 1298, 445.0, 959.5999999999997, 1298.0, 1298.0, 0.09120171673819742, 0.018928757041309013, 0.06096180928111588], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 522.764705882353, 88, 1298, 445.0, 959.5999999999997, 1298.0, 1298.0, 0.0934338021511759, 0.019392022470829415, 0.06245379835886274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 134.41176470588232, 81, 260, 86.0, 256.0, 260.0, 260.0, 0.09547129122113399, 0.033980935225536885, 0.05397681802610298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 95.70588235294117, 81, 254, 86.0, 121.99999999999989, 254.0, 254.0, 0.09547182738693609, 0.07095123109517419, 0.04792238210633316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 134.2941176470588, 83, 414, 85.0, 282.7999999999999, 414.0, 414.0, 0.09546807435278261, 1.6754405746335712, 0.055735411284887966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 153.7058823529412, 83, 754, 85.0, 353.19999999999965, 754.0, 754.0, 0.09547182738693609, 5.077496491761344, 0.0556443681449824], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 191.58823529411765, 84, 382, 177.0, 335.59999999999997, 382.0, 382.0, 0.09201225386722091, 0.1380870939959298, 0.05946334191212288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=550d9108-d521-465e-97d6-f6a62890a5df", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 86.19999999999999, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.08425262306499809, 0.06261352163326518, 0.04229086743692287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 495.625, 403, 591, 493.0, 591.0, 591.0, 591.0, 0.035283325100557476, 10.374469096217627, 0.02012252134641169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 83.53333333333335, 81, 85, 84.0, 85.0, 85.0, 85.0, 0.08425404278981986, 0.02254453879336977, 0.04805113377856914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 676.5, 563, 752, 729.5, 752.0, 752.0, 752.0, 0.03525828900338039, 31.725470422702813, 0.020073811024385515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 165.625, 82, 250, 166.0, 250.0, 250.0, 250.0, 0.03536271090541801, 0.06257542203185296, 0.01958071980798048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 99.53846153846153, 83, 253, 85.0, 190.19999999999993, 253.0, 253.0, 0.07633408493047726, 0.05672874866415351, 0.03831613247486847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 84.76923076923079, 81, 93, 84.0, 92.2, 93.0, 93.0, 0.07634036056139526, 0.020427010540842092, 0.04353786188267074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f082f8d-9c70-46e7-b438-413da8521f0a", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 111.6153846153846, 82, 253, 85.0, 249.8, 253.0, 253.0, 0.07633946397951753, 0.020575871150729334, 0.04487925519108355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 123.0, 82, 251, 85.0, 251.0, 251.0, 251.0, 0.07633946397951753, 0.020575871150729334, 0.04495380544887605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 86.5, 83, 99, 85.0, 99.0, 99.0, 99.0, 0.035362085655811976, 0.02627983123444621, 0.019856639894620984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 481.28571428571416, 83, 844, 731.0, 802.5, 844.0, 844.0, 0.06539000467071461, 33.62929121905652, 0.03523105441382532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 96.86666666666667, 83, 250, 86.0, 155.80000000000007, 250.0, 250.0, 0.08425356954289631, 0.02270896991585877, 0.04953188365705427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 402.4285714285714, 82, 675, 537.5, 669.0, 675.0, 675.0, 0.06534025940082981, 10.985950969136061, 0.03526806133116777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 106.73333333333333, 82, 251, 85.0, 248.6, 251.0, 251.0, 0.08425451604205986, 0.022709225026961443, 0.049614719895861414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1766fd5-2782-4744-8268-1c4d6ffe8475", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 439.4117647058824, 87, 1213, 393.0, 924.1999999999997, 1213.0, 1213.0, 0.09362419249133976, 0.0194315376534473, 0.06297904952169052], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 225.15384615384613, 167, 504, 176.0, 437.5999999999999, 504.0, 504.0, 0.07629600502379848, 0.11824390622340643, 0.17159150348614052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 596.0, 145, 1578, 517.0, 1198.0, 1505.599999999999, 1578.0, 0.10219860298953132, 0.06277629031290546, 0.04620893865639941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 105.28571428571428, 82, 366, 85.0, 229.0, 366.0, 366.0, 0.06539000467071461, 0.048595501517982254, 0.0328227171882298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 108.85714285714286, 82, 255, 84.5, 254.0, 255.0, 255.0, 0.06533781986363064, 0.07355973860205067, 0.03412734341091422], "isController": false}, {"data": ["login", 23, 0, 0.0, 2424.2608695652175, 1474, 3819, 2440.0, 3221.4, 3707.7999999999984, 3819.0, 0.10312467773538209, 43.05053340398868, 0.2150722251054786], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/922e39cd-b3a1-4bc8-b475-dd4d1be2b541", 3, 0, 0.0, 242.33333333333331, 172, 378, 177.0, 378.0, 378.0, 378.0, 0.029653645421477148, 0.029740521335797878, 0.01901617235687174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.66666666666667, 84, 104, 88.0, 98.60000000000001, 104.0, 104.0, 0.08334120444708668, 0.06747056492835435, 0.029625193768300338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79ff58d8-5ab5-48b6-91de-f6b6e776e558", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 599.8571428571429, 169, 928, 822.0, 887.5, 928.0, 928.0, 0.06531252041016262, 44.69279825953796, 0.13734034879218487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fce41b83-74b3-417a-9524-e508ea84d985", 3, 0, 0.0, 585.3333333333333, 171, 1142, 443.0, 1142.0, 1142.0, 1142.0, 0.025582208426779458, 0.025657156303029786, 0.016405257357016773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 425.875, 84, 848, 369.5, 841.0, 848.0, 848.0, 0.06863712410450001, 41.06611417356613, 0.10012373450302432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 300.47058823529414, 170, 839, 327.0, 571.7999999999997, 839.0, 839.0, 0.09542252532906738, 6.854393821391485, 0.2131713343015913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/692496af-85c9-49a1-82b1-ca62e049d3ea", 3, 0, 0.0, 740.3333333333334, 363, 1476, 382.0, 1476.0, 1476.0, 1476.0, 0.01808590806330068, 0.024932884325546346, 0.011598059532780708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99accf58-3ea9-435a-ab40-35730f08e92d", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac1df290-dc35-4822-afa0-6da6fbe5ec3a", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["register", 24, 9, 37.5, 989.2083333333335, 266, 1448, 1024.5, 1399.5, 1445.25, 1448.0, 0.09901807079792062, 0.030798101122204803, 0.04467416866078059], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 195.2, 169, 335, 174.0, 335.0, 335.0, 335.0, 0.08421241740165393, 0.13051279923478984, 0.18939570046485255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 106.1875, 84, 260, 87.0, 215.90000000000003, 260.0, 260.0, 0.10269840047241263, 0.07973166833551568, 0.03650607204292793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=175153f5-9d48-4ba1-8490-a6fea38f9d41", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 334.0625, 168, 843, 257.0, 724.7000000000002, 843.0, 843.0, 0.11054304269725024, 16.680893865724748, 0.2450784596517894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f53f811c-87f5-4add-9d8f-b4e7e4682f99", 3, 0, 0.0, 245.33333333333331, 173, 385, 178.0, 385.0, 385.0, 385.0, 0.04253087032337639, 0.027620145278364545, 0.027274028169613107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dde0fab-4547-44db-82e1-f4ecc25b7a4a", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 110.28571428571428, 82, 264, 86.0, 253.5, 264.0, 264.0, 0.06502343165805106, 0.04832307762868834, 0.032638714718982664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 103.21428571428572, 81, 338, 85.0, 214.5, 338.0, 338.0, 0.06502222366716054, 0.024374262694428057, 0.03669292616262058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 144.64285714285714, 83, 564, 86.5, 417.5, 564.0, 564.0, 0.06502343165805106, 4.195431008107029, 0.03782752650865973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 131.85714285714286, 82, 593, 84.0, 421.0, 593.0, 593.0, 0.06502494170978439, 1.3819523709719372, 0.03789190590426471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 92.25, 87, 102, 90.0, 102.0, 102.0, 102.0, 0.030290179923668746, 0.008933236657175743, 0.01872430067547101], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 792.6727272727272, 651, 1235, 678.0, 1091.2, 1098.0, 1235.0, 0.2434403880882405, 291.23933772595694, 0.48069967257267804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 989.2083333333335, 266, 1448, 1024.5, 1399.5, 1445.25, 1448.0, 0.09746074159502625, 0.030313716990249866, 0.043971545524318485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 109.28571428571429, 81, 255, 85.0, 255.0, 255.0, 255.0, 0.030727900055310224, 0.008282129311782833, 0.018094652083351623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 108.42857142857143, 82, 245, 85.0, 245.0, 245.0, 245.0, 0.030706333400594824, 0.008276316424379074, 0.018051965534334066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f082f8d-9c70-46e7-b438-413da8521f0a", 3, 0, 0.0, 326.6666666666667, 201, 392, 387.0, 392.0, 392.0, 392.0, 0.03808991759881159, 0.024488146893767222, 0.024426151585175405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 177.12500000000003, 82, 742, 84.5, 632.1000000000001, 742.0, 742.0, 0.09630084383614412, 10.854170146287002, 0.05557988154996209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 196.25000000000003, 83, 568, 87.5, 565.9, 568.0, 568.0, 0.09629910502019272, 3.5621029542759812, 0.05567292008979891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 108.57142857142856, 82, 246, 85.0, 246.0, 246.0, 246.0, 0.030706198704198412, 0.008216307075146841, 0.017512128948488158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 107.3125, 83, 254, 87.0, 250.5, 254.0, 254.0, 0.09629852542882937, 0.07156560337044839, 0.048337345771892866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 112.42857142857144, 84, 254, 87.0, 254.0, 254.0, 254.0, 0.030727495401849797, 0.022835570313288762, 0.015423762340381635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 115.37500000000001, 81, 250, 85.0, 247.9, 250.0, 250.0, 0.0962979458444427, 0.04384659887692521, 0.05390898188996756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 112.42857142857143, 87, 248, 90.0, 248.0, 248.0, 248.0, 0.03169500350908967, 0.02494743440266238, 0.011266583278621721], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 441.0625, 84, 1142, 381.5, 860.6000000000003, 1142.0, 1142.0, 0.09108142109787268, 0.01843420363528722, 0.06197361342767851], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1220.6956521739132, 627, 2207, 1194.0, 1711.0, 2109.7999999999984, 2207.0, 0.10235095698144778, 0.0529746164064134, 0.047077442127208886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 246.57142857142856, 169, 501, 179.0, 501.0, 501.0, 501.0, 0.03069421545585295, 0.047570038992615846, 0.06903200995588803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=922e39cd-b3a1-4bc8-b475-dd4d1be2b541", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["addBook", 57, 17, 29.82456140350877, 861.1754385964912, 427, 3236, 720.0, 1307.0, 1687.5999999999965, 3236.0, 0.2721205350749048, 81.06763896049955, 0.9881339632685018], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 145.0, 84, 345, 86.0, 339.8, 343.2, 345.0, 0.24405287516473567, 0.18137132617223034, 0.1179747785220158], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 472.41818181818184, 404, 686, 419.0, 591.8, 654.9999999999999, 686.0, 0.24400631754538518, 71.74595913060548, 0.12271802103112633], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 139.7454545454546, 82, 341, 88.0, 256.4, 259.2, 341.0, 0.24436624724532593, 0.43241371094583064, 0.11884217883610577], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 643.8909090909092, 565, 854, 586.0, 754.0, 760.2, 854.0, 0.2438516140760019, 219.41811099100187, 0.12240207972174315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 98.81249999999999, 85, 254, 87.0, 144.80000000000013, 254.0, 254.0, 0.10896436184340459, 0.08140403985371535, 0.03873342549902273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 17, 10.059171597633137, 157.47337278106514, 84, 2132, 94.0, 263.0, 299.0, 1968.9000000000026, 0.7205747543010639, 1.604113258682073, 0.34404429909182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 103.7857142857143, 85, 251, 89.0, 186.5, 251.0, 251.0, 0.06840179212695373, 0.05297130972331475, 0.024314699545128084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e9edce1-617b-49d1-96f0-6ac13b70651f", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82d6a0df-f23e-48e2-a151-9b8d3540615c", 3, 0, 0.0, 405.0, 169, 686, 360.0, 686.0, 686.0, 686.0, 0.04849738922388012, 0.030168786069933236, 0.031100213792657493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1766fd5-2782-4744-8268-1c4d6ffe8475", 3, 0, 0.0, 323.6666666666667, 268, 355, 348.0, 355.0, 355.0, 355.0, 0.04088196015371617, 0.025431453728434764, 0.026216621582949497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 98.47058823529412, 85, 258, 89.0, 127.59999999999988, 258.0, 258.0, 0.09675418177265044, 0.07851828618464113, 0.03439308805199683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fce41b83-74b3-417a-9524-e508ea84d985", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 258.2857142857143, 166, 837, 174.0, 676.5, 837.0, 837.0, 0.06499596096528287, 5.647662082226854, 0.14498959484303475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 327.3125, 170, 840, 256.0, 830.9, 840.0, 840.0, 0.09624812767314136, 14.523797819528745, 0.213386046728466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/550d9108-d521-465e-97d6-f6a62890a5df", 2, 0, 0.0, 279.0, 157, 401, 279.0, 401.0, 401.0, 401.0, 0.06508298080052066, 0.03822989546046209, 0.04045441140579238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79ff58d8-5ab5-48b6-91de-f6b6e776e558", 3, 0, 0.0, 410.3333333333333, 310, 508, 413.0, 508.0, 508.0, 508.0, 0.06943319369546601, 0.03141671199111255, 0.0445258436133034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 104.07692307692307, 83, 259, 88.0, 200.19999999999993, 259.0, 259.0, 0.07810997885022111, 0.06476110551156028, 0.027765656544414537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/175153f5-9d48-4ba1-8490-a6fea38f9d41", 3, 0, 0.0, 371.0, 175, 740, 198.0, 740.0, 740.0, 740.0, 0.02792802018264925, 0.028009840554278107, 0.01790957023431609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dde0fab-4547-44db-82e1-f4ecc25b7a4a", 3, 0, 0.0, 345.0, 324, 369, 342.0, 369.0, 369.0, 369.0, 0.03515226790715114, 0.02930499938483531, 0.022542307219104087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 102.64285714285714, 85, 251, 89.5, 181.5, 251.0, 251.0, 0.06404479475930593, 0.04972227718129709, 0.022765923137097032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99accf58-3ea9-435a-ab40-35730f08e92d", 3, 0, 0.0, 1004.0, 195, 2101, 716.0, 2101.0, 2101.0, 2101.0, 0.027878709029913854, 0.028141886947188433, 0.017877948173479916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f53f811c-87f5-4add-9d8f-b4e7e4682f99", 1, 0, 0.0, 1213.0, 1213, 1213, 1213.0, 1213.0, 1213.0, 1213.0, 0.8244023083264633, 0.14893987015663643, 0.5683867477328937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=692496af-85c9-49a1-82b1-ca62e049d3ea", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac1df290-dc35-4822-afa0-6da6fbe5ec3a", 3, 0, 0.0, 462.3333333333333, 207, 683, 497.0, 683.0, 683.0, 683.0, 0.060447310094700786, 0.03886179604070119, 0.03876341174692726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f6e6b19-9e21-4cf8-9a61-58f8ac8462f2", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 106.375, 82, 252, 86.0, 248.5, 252.0, 252.0, 0.11060723371308484, 0.08219932114810308, 0.055519646609888285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 136.0625, 81, 251, 85.5, 250.3, 251.0, 251.0, 0.11060952762818607, 0.05036298071937672, 0.06192081221958757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 209.18749999999997, 83, 757, 87.0, 624.7000000000002, 757.0, 757.0, 0.11060952762818607, 12.466917057544608, 0.06383811604322068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 183.31249999999997, 81, 584, 85.0, 584.0, 584.0, 584.0, 0.11061029228769736, 4.09147363154329, 0.06394657522882505], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.428571428571427, 0.6880733944954128], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.523809523809524, 0.3058103975535168], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.523809523809524, 0.3058103975535168], "isController": false}, {"data": ["401/Unauthorized", 25, 59.523809523809526, 1.9113149847094801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 42, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
