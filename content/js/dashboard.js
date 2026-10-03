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

    var data = {"OkPercent": 98.13229571984436, "KoPercent": 1.867704280155642};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7556666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6f57809b-7f75-46e6-ba7d-91c8fb2e69ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d3e7213-572d-4052-93d9-1016d92641ef"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2deb3c35-c250-48eb-84e6-842487791aca"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa102e6b-1a3d-4a55-b778-1249fab98501"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d68cf59a-997a-46e2-a49f-42f2d016e629"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5ecd797-6876-4642-ba1b-249eee3c7849"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf044e1d-b489-4219-b8ce-02d6da781466"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff913386-5b65-45ad-a21d-6b512c7b76cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7cb71f9-d859-448c-818a-6aca6c389321"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27745524-0583-43e9-bea1-bfdf1b35d7a7"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e88d68f4-6cba-4cd2-b1da-66d48c50a3c7"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5ecd797-6876-4642-ba1b-249eee3c7849"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d68cf59a-997a-46e2-a49f-42f2d016e629"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf044e1d-b489-4219-b8ce-02d6da781466"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=234a32ca-83b9-4c68-8c85-29794d3dcf7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d3e7213-572d-4052-93d9-1016d92641ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f8b87cd-04d2-456f-bfd8-ebef0c658ef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa102e6b-1a3d-4a55-b778-1249fab98501"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0d4b549-66ed-4a9a-9dbd-87cfd72fff01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f57809b-7f75-46e6-ba7d-91c8fb2e69ee"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fc1c9f8-3328-4825-9da3-020cce069a48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebf7034d-3efd-4aeb-a26b-a88c21e6722d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e88d68f4-6cba-4cd2-b1da-66d48c50a3c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/234a32ca-83b9-4c68-8c85-29794d3dcf7a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7cb71f9-d859-448c-818a-6aca6c389321"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27745524-0583-43e9-bea1-bfdf1b35d7a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/441c0521-2dba-4b08-b165-db9459f4e7bf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff913386-5b65-45ad-a21d-6b512c7b76cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 24, 1.867704280155642, 405.41634241245106, 98, 4742, 128.0, 1104.8000000000002, 1334.0, 1894.400000000001, 5.041133293841186, 707.2365900582771, 3.678130136757904], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1831.6111111111109, 1308, 2449, 1809.5, 2331.5, 2385.0, 2449.0, 0.24035465664892197, 289.2277264396799, 1.1818219689719942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f57809b-7f75-46e6-ba7d-91c8fb2e69ee", 3, 0, 0.0, 1402.0, 243, 3428, 535.0, 3428.0, 3428.0, 3428.0, 0.018505496132351307, 0.021872869940288933, 0.011867131308832057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d3e7213-572d-4052-93d9-1016d92641ef", 3, 0, 0.0, 352.6666666666667, 232, 591, 235.0, 591.0, 591.0, 591.0, 0.03443802876723336, 0.02870956760185047, 0.022084282770654207], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 588.8571428571429, 107, 1357, 530.5, 1321.5, 1357.0, 1357.0, 0.07369545878055071, 0.015118467094977654, 0.04933421581451906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 588.8571428571429, 107, 1357, 530.5, 1321.5, 1357.0, 1357.0, 0.07293984026174982, 0.014963453558161708, 0.04882837939397413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 150.66666666666666, 100, 338, 107.0, 330.2, 338.0, 338.0, 0.08043628641752867, 0.03763119493465892, 0.044973100765217204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 123.2, 98, 334, 109.0, 202.00000000000009, 334.0, 334.0, 0.08043111075363951, 0.05977351101906217, 0.04037264739001045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 269.8666666666666, 104, 900, 114.0, 870.0, 900.0, 900.0, 0.08043412980996097, 3.1721628871562784, 0.046443378729462484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 268.6, 100, 1312, 110.0, 1303.0, 1312.0, 1312.0, 0.08043154203352386, 9.668447359566528, 0.04636333809666799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2deb3c35-c250-48eb-84e6-842487791aca", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.9706259498480243, 1.8136160714285714], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 255.49999999999991, 105, 493, 232.5, 474.0, 493.0, 493.0, 0.0738907156315809, 0.13282392172334262, 0.047753730491531594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa102e6b-1a3d-4a55-b778-1249fab98501", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 151.0625, 101, 342, 111.5, 335.7, 342.0, 342.0, 0.11868291633596167, 0.08820087825358089, 0.059573260738949516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 803.8333333333334, 619, 882, 835.5, 882.0, 882.0, 882.0, 0.02533452124088485, 7.449190430095722, 0.014448594145192142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 176.75, 104, 342, 112.0, 333.6, 342.0, 342.0, 0.11868643784910503, 0.05404057778041525, 0.06644238329785103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1078.0, 865, 1267, 1088.5, 1267.0, 1267.0, 1267.0, 0.025330349981002236, 22.79229343891164, 0.014421478553637016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 327.8333333333333, 311, 341, 328.5, 341.0, 341.0, 341.0, 0.02538812089823172, 0.044925073308199094, 0.014057680223923227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 112.92307692307693, 105, 125, 112.0, 123.4, 125.0, 125.0, 0.07983002345774536, 0.05932680454232833, 0.04007092974343859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 141.99999999999997, 100, 330, 110.0, 328.0, 330.0, 330.0, 0.07983002345774536, 0.030583918241774435, 0.04501233143583508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d68cf59a-997a-46e2-a49f-42f2d016e629", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5ecd797-6876-4642-ba1b-249eee3c7849", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 192.30769230769232, 103, 1203, 109.0, 767.3999999999996, 1203.0, 1203.0, 0.07983149413852607, 5.545440287961411, 0.04640445475089504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 182.6923076923077, 104, 655, 110.0, 522.9999999999999, 655.0, 655.0, 0.07983149413852607, 1.8254857631276753, 0.04648241519438969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 145.33333333333334, 106, 316, 113.5, 316.0, 316.0, 316.0, 0.025410915682346612, 0.01888447933033767, 0.014268824723973929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 11, 0, 0.0, 966.0, 108, 1347, 1109.0, 1334.2, 1347.0, 1347.0, 0.0686346080651904, 50.532260654352996, 0.03552377175249112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 230.56249999999997, 104, 996, 112.0, 949.1, 996.0, 996.0, 0.11869348150236274, 13.378068064220592, 0.06850375739052382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 11, 0, 0.0, 621.090909090909, 111, 955, 659.0, 935.0000000000001, 955.0, 955.0, 0.06862989767906164, 16.51383760060519, 0.035588355144122785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 257.00000000000006, 102, 895, 111.5, 871.9, 895.0, 895.0, 0.11868643784910503, 4.39021017699115, 0.06861559688151385], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 637.9999999999999, 109, 1681, 563.5, 1462.0, 1681.0, 1681.0, 0.07278701479656029, 0.014932101738049932, 0.04907132380083393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf044e1d-b489-4219-b8ce-02d6da781466", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 341.3076923076923, 214, 1324, 224.0, 971.5999999999997, 1324.0, 1324.0, 0.07977515678886585, 7.455573291891162, 0.17784610336712528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 920.7391304347825, 228, 2620, 853.0, 1838.6000000000004, 2481.799999999998, 2620.0, 0.10104515839926895, 0.06206777796205095, 0.04568741048716946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 11, 0, 0.0, 109.54545454545455, 104, 116, 107.0, 115.8, 116.0, 116.0, 0.0686346080651904, 0.05100677415782216, 0.034451356001472526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 11, 0, 0.0, 276.6363636363636, 106, 411, 323.0, 396.80000000000007, 411.0, 411.0, 0.06863246690043301, 0.10270497710171332, 0.03442590891223779], "isController": false}, {"data": ["login", 23, 0, 0.0, 3394.130434782608, 1876, 6082, 3097.0, 5147.000000000001, 5938.599999999998, 6082.0, 0.10029565414569906, 31.438531300965455, 0.19471035132913544], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 115.43749999999999, 104, 133, 114.0, 128.1, 133.0, 133.0, 0.11331846028542088, 0.09173926130528702, 0.0402811714295832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 11, 0, 0.0, 1078.0, 220, 1453, 1215.0, 1442.4, 1453.0, 1453.0, 0.06858325695652445, 67.15066816069057, 0.13988816837501325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff913386-5b65-45ad-a21d-6b512c7b76cd", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7cb71f9-d859-448c-818a-6aca6c389321", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27745524-0583-43e9-bea1-bfdf1b35d7a7", 3, 0, 0.0, 369.3333333333333, 288, 473, 347.0, 473.0, 473.0, 473.0, 0.03598028280502285, 0.02313185499346358, 0.02307329333525228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 666.25, 105, 1381, 572.5, 1372.3, 1381.0, 1381.0, 0.050636329878810386, 30.29610187291125, 0.07386525171530567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 469.0666666666667, 213, 1420, 229.0, 1407.4, 1420.0, 1420.0, 0.08038197514589329, 12.92993785636009, 0.17803874846604398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e88d68f4-6cba-4cd2-b1da-66d48c50a3c7", 3, 0, 0.0, 513.6666666666666, 493, 536, 512.0, 536.0, 536.0, 536.0, 0.028027691359062752, 0.028109803736091257, 0.017973486971794798], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1210.875, 297, 1893, 1222.5, 1705.5, 1853.75, 1893.0, 0.09968805944731278, 0.03129854600811627, 0.04497644869595557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 116.29411764705883, 101, 132, 115.0, 131.2, 132.0, 132.0, 0.074226732102625, 0.05762719923983094, 0.026385283677104982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 437.375, 219, 1106, 229.0, 1053.5, 1106.0, 1106.0, 0.11858439874004076, 17.894330762460626, 0.2629064758198999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5ecd797-6876-4642-ba1b-249eee3c7849", 3, 0, 0.0, 391.3333333333333, 252, 508, 414.0, 508.0, 508.0, 508.0, 0.056902241948332766, 0.02574678265240317, 0.03649004447858579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d68cf59a-997a-46e2-a49f-42f2d016e629", 3, 0, 0.0, 520.0, 226, 679, 655.0, 679.0, 679.0, 679.0, 0.050060907437382146, 0.03218433990521802, 0.03210286056368582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf044e1d-b489-4219-b8ce-02d6da781466", 3, 0, 0.0, 395.0, 323, 519, 343.0, 519.0, 519.0, 519.0, 0.059497838245210426, 0.03825137712704772, 0.03815453819761216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 318.1764705882354, 219, 664, 229.0, 497.59999999999985, 664.0, 664.0, 0.09581027311563736, 0.14848721038527002, 0.2154795497903446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=234a32ca-83b9-4c68-8c85-29794d3dcf7a", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 158.1, 106, 344, 111.5, 344.0, 344.0, 344.0, 0.07884507730759831, 0.05859482796004131, 0.03957653294541555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 149.7, 103, 323, 109.5, 321.6, 323.0, 323.0, 0.07884569896712135, 0.021097384293936768, 0.04496668769218639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d3e7213-572d-4052-93d9-1016d92641ef", 1, 0, 0.0, 1243.0, 1243, 1243, 1243.0, 1243.0, 1243.0, 1243.0, 0.8045052292839903, 0.14534518302493965, 0.5546686444086886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f8b87cd-04d2-456f-bfd8-ebef0c658ef5", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 174.99999999999997, 105, 341, 109.0, 339.5, 341.0, 341.0, 0.07884694231557701, 0.021251714920995365, 0.04635337819724351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 111.66666666666667, 109, 116, 110.0, 116.0, 116.0, 116.0, 0.017870865128580875, 0.005270509051593188, 0.011047126588273138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa102e6b-1a3d-4a55-b778-1249fab98501", 3, 0, 0.0, 326.3333333333333, 230, 431, 318.0, 431.0, 431.0, 431.0, 0.020745883670914966, 0.024520932164418044, 0.013303838161361483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 154.4, 100, 338, 110.5, 337.1, 338.0, 338.0, 0.0788463206364475, 0.021251547359042493, 0.046430011077908055], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1244.5925925925928, 849, 1903, 1136.5, 1871.5, 1888.5, 1903.0, 0.250188799881392, 299.31278435810356, 0.49402514976579553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1210.875, 297, 1893, 1222.5, 1705.5, 1853.75, 1893.0, 0.09741050409935871, 0.030583473699163893, 0.04394887977920286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 158.9230769230769, 103, 331, 111.0, 330.6, 331.0, 331.0, 0.0637333006495894, 0.017178116190709646, 0.03753044950361564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 176.23076923076923, 105, 334, 112.0, 329.6, 334.0, 334.0, 0.06379835792841825, 0.01719565116039398, 0.03750645651651151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 230.88235294117646, 100, 1148, 110.0, 495.99999999999943, 1148.0, 1148.0, 0.07485952829690169, 3.9812686391968892, 0.04363078895337572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 165.11764705882354, 102, 826, 110.0, 437.99999999999966, 826.0, 826.0, 0.07492518499909649, 1.3149180588427145, 0.04374222513475515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 138.64705882352942, 101, 325, 115.0, 314.59999999999997, 325.0, 325.0, 0.07492188291913285, 0.055679250880332126, 0.03760727326214285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 125.84615384615385, 101, 335, 110.0, 246.99999999999991, 335.0, 335.0, 0.06379898412386818, 0.017071212548769418, 0.03638535813314357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0d4b549-66ed-4a9a-9dbd-87cfd72fff01", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 174.88235294117644, 102, 340, 113.0, 336.0, 340.0, 340.0, 0.07492419434454552, 0.026667641783019534, 0.04236005978509978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 126.46153846153845, 106, 309, 112.0, 232.19999999999993, 309.0, 309.0, 0.06379647941582055, 0.04741125081585883, 0.0320228422067693], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 461.2857142857143, 106, 828, 513.5, 741.5, 828.0, 828.0, 0.07228940547127528, 0.014406447504982805, 0.04918967287753142], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 129.3846153846154, 105, 317, 115.0, 237.39999999999992, 317.0, 317.0, 0.06509275717898004, 0.051235119420173746, 0.023138441028465562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1749.6086956521742, 856, 4742, 1669.0, 2374.6000000000004, 4280.599999999993, 4742.0, 0.1000269637902391, 0.05177176836799485, 0.046008496040236935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 321.9230769230769, 213, 641, 228.0, 565.8, 641.0, 641.0, 0.0636980126220062, 0.09871947854601937, 0.14325832330906277], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 1181.2241379310342, 551, 3847, 993.0, 1923.1000000000001, 2083.9499999999985, 3847.0, 0.25671327340406225, 80.41908960565743, 0.9337884807110958], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f57809b-7f75-46e6-ba7d-91c8fb2e69ee", 1, 0, 0.0, 1681.0, 1681, 1681, 1681.0, 1681.0, 1681.0, 1681.0, 0.5948839976204641, 0.10747415972635335, 0.41014463117192146], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 200.61111111111114, 106, 575, 114.5, 448.0, 457.25, 575.0, 0.25125861956653234, 0.18672637645520618, 0.12145802410686866], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 710.8333333333333, 514, 1087, 646.0, 975.5, 1015.25, 1087.0, 0.2510250188268764, 73.8096903501799, 0.12624793427328257], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 162.03703703703704, 102, 479, 113.0, 333.5, 334.75, 479.0, 0.25168606358335704, 0.4453663547002372, 0.1224020113911248], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1036.1481481481483, 689, 1462, 982.0, 1399.5, 1454.25, 1462.0, 0.2507557499686556, 225.630464603388, 0.1258676323084853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 130.3529411764706, 111, 328, 115.0, 173.59999999999985, 328.0, 328.0, 0.09320941963429011, 0.06963399025413275, 0.03313303588562656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 211.64117647058814, 102, 2211, 116.0, 398.6, 596.0499999999995, 1476.8599999999917, 0.696826977861397, 1.4875302556125314, 0.3361045335255756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 115.8, 111, 123, 115.5, 122.5, 123.0, 123.0, 0.08609111884018045, 0.06667017308619443, 0.03060270240022039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 120.33333333333333, 109, 148, 116.0, 141.4, 148.0, 148.0, 0.07690178104524902, 0.06240759770371282, 0.027336179980928358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 358.2, 211, 686, 232.5, 684.4, 686.0, 686.0, 0.07877613398244868, 0.12208762170912701, 0.1771693716421673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 414.64705882352945, 217, 1250, 419.0, 773.1999999999996, 1250.0, 1250.0, 0.07482163841783043, 5.374590269005797, 0.16714951151372978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fc1c9f8-3328-4825-9da3-020cce069a48", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.7176088483146067, 1.3408532303370786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebf7034d-3efd-4aeb-a26b-a88c21e6722d", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 132.53846153846155, 110, 349, 115.0, 258.19999999999993, 349.0, 349.0, 0.08046645786652472, 0.06671486594597606, 0.02860331119474121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e88d68f4-6cba-4cd2-b1da-66d48c50a3c7", 1, 0, 0.0, 1173.0, 1173, 1173, 1173.0, 1173.0, 1173.0, 1173.0, 0.8525149190110827, 0.15401880861040068, 0.5877690750213128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/234a32ca-83b9-4c68-8c85-29794d3dcf7a", 3, 0, 0.0, 343.6666666666667, 214, 473, 344.0, 473.0, 473.0, 473.0, 0.02232458457668867, 0.02638690318943898, 0.014316221229191626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7cb71f9-d859-448c-818a-6aca6c389321", 3, 0, 0.0, 333.6666666666667, 203, 585, 213.0, 585.0, 585.0, 585.0, 0.032623943799819484, 0.026517574110725667, 0.02092095354350403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27745524-0583-43e9-bea1-bfdf1b35d7a7", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 11, 0, 0.0, 115.36363636363636, 107, 127, 115.0, 125.80000000000001, 127.0, 127.0, 0.06490556240669826, 0.05039054893879406, 0.02307189913675602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/441c0521-2dba-4b08-b165-db9459f4e7bf", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff913386-5b65-45ad-a21d-6b512c7b76cd", 3, 0, 0.0, 561.0, 400, 828, 455.0, 828.0, 828.0, 828.0, 0.018895614327914492, 0.026036827945983738, 0.012117304761064956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 125.3529411764706, 106, 336, 113.0, 159.99999999999983, 336.0, 336.0, 0.09589566551591867, 0.07126621236095128, 0.048135128979670115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 163.1764705882353, 100, 341, 112.0, 337.0, 341.0, 341.0, 0.09587241073996582, 0.02565335990502992, 0.054677234250136764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 146.41176470588235, 103, 328, 109.0, 324.8, 328.0, 328.0, 0.09589620645889156, 0.025847024397123112, 0.05637648075024679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 150.8235294117647, 101, 331, 111.0, 331.0, 331.0, 331.0, 0.09587024807836547, 0.02584002780237194, 0.05645484335083435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5447470817120622], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.23346303501945526], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.5, 0.23346303501945526], "isController": false}, {"data": ["401/Unauthorized", 11, 45.833333333333336, 0.8560311284046692], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 24, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
