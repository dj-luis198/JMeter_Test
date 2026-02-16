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

    var data = {"OkPercent": 69.16802610114192, "KoPercent": 30.831973898858074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5391566265060241, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ee38816-c615-4869-b778-0878192589d4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/212566da-948f-4dc2-b767-658e38d6273e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dd67fe2-c86f-4fa1-b795-c982d077e98c"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b39719d-6271-43de-8e94-4ddf5c130b19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c013f1e-55c6-4420-a0e1-735b881f7c11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54c90d21-50c8-453f-8f49-36d932605ed3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54c90d21-50c8-453f-8f49-36d932605ed3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/377ddb20-21d0-414f-8b62-38b4fa356e67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dd67fe2-c86f-4fa1-b795-c982d077e98c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=212566da-948f-4dc2-b767-658e38d6273e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39320b7d-e18a-4e3f-ac66-234b61dcd06b"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39320b7d-e18a-4e3f-ac66-234b61dcd06b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19189f59-0ed8-4061-aa10-12a64f42345b"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9719101123595506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19189f59-0ed8-4061-aa10-12a64f42345b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83b1ce3d-0205-4d23-8b57-f2ceea521501"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd0bad03-5ac1-4920-b4c7-a465be1885a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bd2bcfe-9052-491f-871b-2cfce243383e"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65a01edc-c129-4d17-8e5f-dd0508c7edbb"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf4f1b8d-a8a7-4656-aa90-90d68305cb88"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=377ddb20-21d0-414f-8b62-38b4fa356e67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd0bad03-5ac1-4920-b4c7-a465be1885a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bd2bcfe-9052-491f-871b-2cfce243383e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4331fb3a-c5f8-4c66-a92c-9a11b68b1fc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83b1ce3d-0205-4d23-8b57-f2ceea521501"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8ac3b21-4c30-41fd-945e-b350ab49662f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cb01c55-85a5-4573-85a8-c0a3694bdbe1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf4f1b8d-a8a7-4656-aa90-90d68305cb88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ee38816-c615-4869-b778-0878192589d4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c82b9df-da5d-4304-b924-f0be69f9122d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f62de1a5-73bd-4390-a133-201e0599ab2c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f62de1a5-73bd-4390-a133-201e0599ab2c"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c82b9df-da5d-4304-b924-f0be69f9122d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 613, 189, 30.831973898858074, 256.59869494290393, 99, 2229, 108.0, 539.8000000000001, 1013.4999999999993, 1501.4800000000002, 2.4166968918045195, 2.503052595189472, 1.1586178787768282], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 573.5000000000003, 404, 871, 607.0, 746.3000000000001, 769.3499999999998, 871.0, 0.24972766767275345, 1.6067472756003152, 0.4192205671186164], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 132.55, 100, 299, 103.0, 296.9, 298.9, 299.0, 0.14455462719361645, 0.07185381371245193, 0.07255964685304576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 128.50000000000003, 101, 299, 104.0, 298.3, 299.0, 299.0, 0.10816730778331385, 0.08397754852317822, 0.03845009768859984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ee38816-c615-4869-b778-0878192589d4", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, 100.0, 102.07692307692308, 99, 109, 102.0, 107.4, 109.0, 109.0, 0.06241268225703463, 0.031023491473467408, 0.03132824089855059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/212566da-948f-4dc2-b767-658e38d6273e", 3, 0, 0.0, 338.3333333333333, 175, 467, 373.0, 467.0, 467.0, 467.0, 0.03886715207421035, 0.032401945462907776, 0.024924573433005984], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 202.3793103448276, 100, 538, 104.0, 406.1, 413.44999999999993, 538.0, 0.2529647027010524, 0.12574124382308172, 0.12228274202834076], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 459.9285714285714, 102, 866, 421.0, 726.5, 866.0, 866.0, 0.08343216071417929, 0.015754105681730145, 0.0564226282173527], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 459.9285714285714, 102, 866, 421.0, 726.5, 866.0, 866.0, 0.08486545794007286, 0.01602474851030812, 0.05739192346044966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dd67fe2-c86f-4fa1-b795-c982d077e98c", 3, 0, 0.0, 267.6666666666667, 184, 429, 190.0, 429.0, 429.0, 429.0, 0.02400845097474311, 0.028377176266045648, 0.015396044407631485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1063.090909090909, 189, 2002, 1122.5, 1830.3999999999996, 1998.3999999999999, 2002.0, 0.08806516822448612, 0.028130191341592777, 0.039732527070031824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b39719d-6271-43de-8e94-4ddf5c130b19", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c013f1e-55c6-4420-a0e1-735b881f7c11", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54c90d21-50c8-453f-8f49-36d932605ed3", 3, 0, 0.0, 415.33333333333337, 180, 759, 307.0, 759.0, 759.0, 759.0, 0.01702939273185518, 0.02347639264954645, 0.010920541563071194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54c90d21-50c8-453f-8f49-36d932605ed3", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 131.15384615384616, 101, 298, 105.0, 280.4, 298.0, 298.0, 0.07766479872868698, 0.06113069118683761, 0.027607408923087953], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 459.28571428571433, 99, 759, 442.0, 716.5, 759.0, 759.0, 0.08530343650987084, 0.017339161132098463, 0.05754530793017304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1149.7142857142858, 651, 2229, 1063.0, 1684.8000000000002, 2179.0999999999995, 2229.0, 0.08849147321447383, 0.04580125078483509, 0.04070262098048552], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 208.42857142857144, 99, 344, 190.5, 315.0, 344.0, 344.0, 0.08304958059961796, 0.18033275631176812, 0.05318625833461862], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 13, 100.0, 102.46153846153847, 101, 105, 102.0, 105.0, 105.0, 105.0, 0.0771728612728773, 0.038360338269428265, 0.03873715888111224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/377ddb20-21d0-414f-8b62-38b4fa356e67", 3, 0, 0.0, 875.6666666666666, 189, 1836, 602.0, 1836.0, 1836.0, 1836.0, 0.02990341197930684, 0.03534482060444764, 0.019176341666417473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dd67fe2-c86f-4fa1-b795-c982d077e98c", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=212566da-948f-4dc2-b767-658e38d6273e", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39320b7d-e18a-4e3f-ac66-234b61dcd06b", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 634.0333333333334, 413, 1603, 610.5, 785.2, 850.1499999999997, 1603.0, 0.28271881258098713, 0.8733314804452822, 0.5537589085875839], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39320b7d-e18a-4e3f-ac66-234b61dcd06b", 3, 0, 0.0, 689.6666666666666, 251, 1442, 376.0, 1442.0, 1442.0, 1442.0, 0.06857456340861295, 0.03102820414647527, 0.043975224581695165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 159.46153846153845, 102, 427, 105.0, 377.4, 427.0, 427.0, 0.06309944472488642, 0.04713972188919738, 0.02242988074204947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19189f59-0ed8-4061-aa10-12a64f42345b", 3, 0, 0.0, 278.6666666666667, 230, 348, 258.0, 348.0, 348.0, 348.0, 0.08971291866028708, 0.04059275941985646, 0.05753074536483254], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 395.3571428571429, 111, 819, 394.0, 687.5, 819.0, 819.0, 0.08510431357292224, 0.01606985050515489, 0.058242077320308325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, 2.247191011235955, 170.87078651685397, 100, 1101, 109.5, 303.1, 392.2499999999999, 658.6000000000045, 0.7325042592242039, 1.5553257406317642, 0.3525642921663196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 124.6666666666667, 101, 334, 103.0, 274.0000000000002, 334.0, 334.0, 0.06643782526851953, 0.05145038616985937, 0.023616570700919055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, 100.0, 145.0, 99, 305, 101.0, 305.0, 305.0, 305.0, 0.05172354340754704, 0.025710237885196722, 0.025962794249491383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19189f59-0ed8-4061-aa10-12a64f42345b", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83b1ce3d-0205-4d23-8b57-f2ceea521501", 3, 0, 0.0, 289.0, 182, 436, 249.0, 436.0, 436.0, 436.0, 0.04612120653076284, 0.029651491828859573, 0.02957642476093841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 117.52941176470588, 101, 309, 104.0, 158.59999999999985, 309.0, 309.0, 0.09934723025765997, 0.08062260580480023, 0.035314835755652564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd0bad03-5ac1-4920-b4c7-a465be1885a4", 3, 0, 0.0, 279.3333333333333, 191, 448, 199.0, 448.0, 448.0, 448.0, 0.01844054461075084, 0.021796099440636815, 0.01182547945415988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bd2bcfe-9052-491f-871b-2cfce243383e", 3, 0, 0.0, 324.3333333333333, 237, 392, 344.0, 392.0, 392.0, 392.0, 0.027144162647822583, 0.027223686561829878, 0.017406901177151855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 427.1428571428572, 123, 1282, 316.0, 1078.4, 1267.3999999999999, 1282.0, 0.0868737848012245, 0.05336290101559592, 0.03927984605758491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65a01edc-c129-4d17-8e5f-dd0508c7edbb", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["login", 21, 2, 9.523809523809524, 1965.7142857142858, 1332, 3268, 1687.0, 3127.6000000000004, 3263.4, 3268.0, 0.0912281921178842, 0.133932013818899, 0.1373386469230034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf4f1b8d-a8a7-4656-aa90-90d68305cb88", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 139.16666666666669, 100, 354, 101.0, 337.20000000000005, 354.0, 354.0, 0.06403791044298225, 0.031831344155740196, 0.03214402926532507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=377ddb20-21d0-414f-8b62-38b4fa356e67", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 104.1, 101, 110, 103.0, 107.9, 109.9, 110.0, 0.14220098687484892, 0.11512169738207985, 0.050548007053168954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd0bad03-5ac1-4920-b4c7-a465be1885a4", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 0.22059104090354092, 0.8418231074481075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bd2bcfe-9052-491f-871b-2cfce243383e", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 126.1875, 100, 297, 101.0, 297.0, 297.0, 297.0, 0.10590205383795663, 0.05264076699562492, 0.05315786686788057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4331fb3a-c5f8-4c66-a92c-9a11b68b1fc7", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83b1ce3d-0205-4d23-8b57-f2ceea521501", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8ac3b21-4c30-41fd-945e-b350ab49662f", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 126.22222222222223, 100, 317, 103.0, 317.0, 317.0, 317.0, 0.04963682390509439, 0.04115396825725111, 0.01764433974751402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cb01c55-85a5-4573-85a8-c0a3694bdbe1", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 124.16666666666667, 99, 295, 102.5, 294.1, 295.0, 295.0, 0.07961642575325985, 0.03957496162930592, 0.03996371370817926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf4f1b8d-a8a7-4656-aa90-90d68305cb88", 3, 0, 0.0, 352.3333333333333, 191, 459, 407.0, 459.0, 459.0, 459.0, 0.04250014166713889, 0.03454519978608262, 0.027254322618575397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 105.38888888888889, 101, 111, 105.0, 110.1, 111.0, 111.0, 0.08059569171252413, 0.06257185049946941, 0.02864924978843631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ee38816-c615-4869-b778-0878192589d4", 3, 0, 0.0, 395.33333333333337, 191, 674, 321.0, 674.0, 674.0, 674.0, 0.019552125967830233, 0.023109950973044135, 0.012538309946818217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 127.6470588235294, 100, 303, 103.0, 303.0, 303.0, 303.0, 0.10600750782584836, 0.05269318504234064, 0.05321079982664654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 99.5, 99, 101, 99.0, 101.0, 101.0, 101.0, 0.038550129624810865, 0.019162124979520245, 0.021976209148909513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c82b9df-da5d-4304-b924-f0be69f9122d", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f62de1a5-73bd-4390-a133-201e0599ab2c", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f62de1a5-73bd-4390-a133-201e0599ab2c", 3, 0, 0.0, 333.3333333333333, 183, 555, 262.0, 555.0, 555.0, 555.0, 0.09510826490822052, 0.04297209364993818, 0.060990651650128395], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1063.090909090909, 189, 2002, 1122.5, 1830.3999999999996, 1998.3999999999999, 2002.0, 0.09013881377321074, 0.02879256498189029, 0.04066809762033531], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c82b9df-da5d-4304-b924-f0be69f9122d", 3, 0, 0.0, 493.6666666666667, 286, 809, 386.0, 809.0, 809.0, 809.0, 0.01675172821996136, 0.023093609704276156, 0.010742481963972615], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 1.5873015873015872, 0.4893964110929853], "isController": false}, {"data": ["401/Unauthorized", 6, 3.1746031746031744, 0.9787928221859706], "isController": false}, {"data": ["404/Not Found", 180, 95.23809523809524, 29.363784665579118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 613, 189, "404/Not Found", 180, "401/Unauthorized", 6, "406/Not Acceptable", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
