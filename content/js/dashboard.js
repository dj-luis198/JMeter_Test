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

    var data = {"OkPercent": 97.32415902140673, "KoPercent": 2.675840978593272};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7685245901639344, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12410842-ae55-435f-ae7b-49d235260e6c"], "isController": false}, {"data": [0.17592592592592593, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1de92fd7-dc22-4db9-9992-dfd77d55a187"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=763960bb-a089-4b30-9c88-e5c06d9bd081"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28524d36-dec8-422b-94a8-7106f65972f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5482db57-b62d-425d-8c09-82162d9b9d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00327536-d71d-4ceb-b771-d93245ad135a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/175c0588-6944-4715-a6d3-afae915c00fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb757de2-14e8-4c7f-ae27-e450ed7acbb2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5903fa36-e7ff-42cf-a9c7-5ccc01fc49f8"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00327536-d71d-4ceb-b771-d93245ad135a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12410842-ae55-435f-ae7b-49d235260e6c"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0aa8c471-5891-48f0-9898-79d9b8b25a2a"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0aa8c471-5891-48f0-9898-79d9b8b25a2a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5482db57-b62d-425d-8c09-82162d9b9d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb757de2-14e8-4c7f-ae27-e450ed7acbb2"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/763960bb-a089-4b30-9c88-e5c06d9bd081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1de92fd7-dc22-4db9-9992-dfd77d55a187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28524d36-dec8-422b-94a8-7106f65972f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de483e0e-447e-4876-a3e5-db208ac8bf79"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/711d77c2-c7ca-4d18-876b-e51e84a9e7ec"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=175c0588-6944-4715-a6d3-afae915c00fc"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5185185185185185, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9005681818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=711d77c2-c7ca-4d18-876b-e51e84a9e7ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb1d50ec-b045-4083-8118-0aaeacf9563f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5903fa36-e7ff-42cf-a9c7-5ccc01fc49f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f68105d-225b-4bb0-ba9f-e5b4028bf9e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 35, 2.675840978593272, 353.8325688073401, 99, 5303, 119.0, 869.0, 1083.55, 1790.920000000001, 5.220494031155334, 710.0476565275134, 3.822645202473748], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/12410842-ae55-435f-ae7b-49d235260e6c", 3, 0, 0.0, 348.0, 213, 514, 317.0, 514.0, 514.0, 514.0, 0.0191682267473436, 0.02642494800618495, 0.012292124574305632], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1619.7407407407406, 1246, 2752, 1612.5, 1955.0, 2089.0, 2752.0, 0.24271953757433287, 292.07293160253323, 1.1934500700066073], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1de92fd7-dc22-4db9-9992-dfd77d55a187", 3, 0, 0.0, 1010.6666666666666, 222, 2094, 716.0, 2094.0, 2094.0, 2094.0, 0.0411884233071558, 0.03433709377917513, 0.02641314906090395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=763960bb-a089-4b30-9c88-e5c06d9bd081", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 0.1781696868836292, 0.6799340483234714], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 469.71428571428567, 101, 879, 514.5, 758.5, 879.0, 879.0, 0.09008371350805283, 0.018480482800445272, 0.06030506407204123], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 469.71428571428567, 101, 879, 514.5, 758.5, 879.0, 879.0, 0.09300100972524845, 0.019078959933172133, 0.062258000162751764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 109.15384615384616, 102, 114, 109.0, 113.6, 114.0, 114.0, 0.09687756166629405, 0.04830778653401893, 0.05399876108502869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 146.1538461538462, 107, 335, 112.0, 332.6, 335.0, 335.0, 0.09687178646477593, 0.07199163037079538, 0.048625095940326976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 258.0769230769231, 104, 769, 111.0, 751.8, 769.0, 769.0, 0.09687323020060211, 4.4042389489999705, 0.05576469073221259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 314.0, 105, 1108, 116.0, 1034.3999999999999, 1108.0, 1108.0, 0.09686745551548388, 13.431554643490506, 0.055666769433101844], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 240.93333333333334, 100, 515, 227.0, 422.00000000000006, 515.0, 515.0, 0.08847678369195923, 0.16667159740409115, 0.05717581737802001], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28524d36-dec8-422b-94a8-7106f65972f9", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 125.64285714285715, 104, 324, 110.5, 222.5, 324.0, 324.0, 0.07308987444203713, 0.05431776801795923, 0.03668769088203817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 827.4285714285714, 590, 1310, 782.0, 1310.0, 1310.0, 1310.0, 0.03139252768148244, 9.230445468376512, 0.017903550943345458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 123.35714285714285, 104, 322, 108.0, 219.0, 322.0, 322.0, 0.07309369044822095, 0.01955827263946537, 0.04168624533375101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 997.2857142857143, 736, 1994, 770.0, 1994.0, 1994.0, 1994.0, 0.03138872696291647, 28.243631696728848, 0.017870730292363572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5482db57-b62d-425d-8c09-82162d9b9d60", 3, 0, 0.0, 412.3333333333333, 339, 461, 437.0, 461.0, 461.0, 461.0, 0.03783149850565581, 0.02432200831662442, 0.02426043361202537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 212.14285714285714, 112, 349, 131.0, 349.0, 349.0, 349.0, 0.03144442198414303, 0.05564188733912809, 0.017411120375985446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00327536-d71d-4ceb-b771-d93245ad135a", 3, 0, 0.0, 446.0, 360, 529, 449.0, 529.0, 529.0, 529.0, 0.04254051984515251, 0.02696171619092185, 0.02728021617674168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 151.26666666666665, 102, 325, 111.0, 317.2, 325.0, 325.0, 0.07238543798015673, 0.05379425615517508, 0.036334096798633364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 150.26666666666668, 104, 330, 109.0, 322.8, 330.0, 330.0, 0.0723878832335185, 0.01936941406834381, 0.04128371465661601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 178.2, 99, 336, 110.0, 331.8, 336.0, 336.0, 0.07231424879958348, 0.019490949871762732, 0.04251286892319263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/175c0588-6944-4715-a6d3-afae915c00fc", 3, 0, 0.0, 317.6666666666667, 205, 495, 253.0, 495.0, 495.0, 495.0, 0.01935084369678518, 0.02287204214291243, 0.012409232448784766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 150.80000000000004, 100, 331, 108.0, 328.0, 331.0, 331.0, 0.07231041414584528, 0.019489916312747362, 0.04258123020502413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 112.28571428571429, 108, 118, 111.0, 118.0, 118.0, 118.0, 0.03147793396828823, 0.02339326928697983, 0.017675597687271224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb757de2-14e8-4c7f-ae27-e450ed7acbb2", 3, 0, 0.0, 356.0, 255, 481, 332.0, 481.0, 481.0, 481.0, 0.017930894333239692, 0.02471918538452803, 0.011498652941563216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 478.55, 105, 1014, 219.0, 983.9, 1012.5, 1014.0, 0.09970835306727821, 40.387769095707554, 0.054761697036169205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 158.2857142857143, 109, 347, 112.0, 339.0, 347.0, 347.0, 0.0730910192020549, 0.01970031376930386, 0.04296952496058306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 412.6, 99, 868, 224.0, 846.9000000000001, 867.25, 868.0, 0.09970835306727821, 13.20768587818132, 0.05485906847471147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 141.5, 104, 343, 108.5, 342.5, 343.0, 343.0, 0.07309292721510727, 0.019700828038446878, 0.04304202647530242], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 550.2142857142857, 100, 1083, 567.5, 1048.5, 1083.0, 1083.0, 0.09332524514542073, 0.019145476142067686, 0.06291772421390146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 362.8666666666666, 209, 647, 227.0, 645.2, 647.0, 647.0, 0.07227139353701018, 0.1120065444758156, 0.16254005792552192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5903fa36-e7ff-42cf-a9c7-5ccc01fc49f8", 3, 0, 0.0, 502.0, 244, 1004, 258.0, 1004.0, 1004.0, 1004.0, 0.020886419649943606, 0.028793615630700254, 0.013393960517704723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 668.4285714285714, 117, 3061, 397.0, 1658.8000000000002, 2928.099999999998, 3061.0, 0.09055627425614489, 0.05562489893272962, 0.040944877910737386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 120.9, 104, 305, 111.0, 132.10000000000005, 296.4499999999999, 305.0, 0.09970636475579418, 0.07409818708902283, 0.05004792137156076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 166.05, 100, 394, 109.0, 336.0, 391.09999999999997, 394.0, 0.09970934725275821, 0.0940714847469626, 0.05309717486028228], "isController": false}, {"data": ["login", 21, 0, 0.0, 2836.904761904762, 1560, 5781, 2590.0, 5312.400000000001, 5749.599999999999, 5781.0, 0.0895915903360538, 35.848039230717546, 0.1846951632806734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 116.00000000000001, 112, 122, 115.5, 120.5, 122.0, 122.0, 0.07549978158991755, 0.06112238177543129, 0.026837812987041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00327536-d71d-4ceb-b771-d93245ad135a", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 609.5, 214, 1124, 436.5, 1092.9, 1122.45, 1124.0, 0.099652213773929, 53.73335438226838, 0.21264653546622286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12410842-ae55-435f-ae7b-49d235260e6c", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 612.7857142857142, 99, 2108, 483.0, 1711.5, 2108.0, 2108.0, 0.06260676689711919, 37.45810552202864, 0.09125058554096718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 497.15384615384613, 222, 1254, 432.0, 1242.0, 1254.0, 1254.0, 0.0967874027472732, 17.940983241354278, 0.2138672965603246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aa8c471-5891-48f0-9898-79d9b8b25a2a", 3, 0, 0.0, 478.0, 418, 515, 501.0, 515.0, 515.0, 515.0, 0.03541745372119381, 0.028995734410417456, 0.022712364528239517], "isController": false}, {"data": ["register", 24, 9, 37.5, 892.0833333333334, 260, 2555, 658.0, 2029.0, 2517.0, 2555.0, 0.09749439407234084, 0.030324184093789605, 0.0439867285756069], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 125.83333333333333, 105, 332, 114.0, 145.7000000000003, 332.0, 332.0, 0.10664265232125507, 0.08279385605019314, 0.03790813031732113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 319.07142857142856, 217, 647, 226.5, 551.5, 647.0, 647.0, 0.07304754351546522, 0.11320942535062821, 0.1642856374180824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0aa8c471-5891-48f0-9898-79d9b8b25a2a", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 463.66666666666674, 214, 1096, 447.0, 823.6000000000001, 1096.0, 1096.0, 0.1295046017301815, 10.516161499792792, 0.289049886791394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5482db57-b62d-425d-8c09-82162d9b9d60", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 111.58333333333334, 106, 120, 110.5, 118.80000000000001, 120.0, 120.0, 0.05392725213686737, 0.040076795777496156, 0.027068952732763503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 146.16666666666666, 104, 337, 109.0, 333.1, 337.0, 337.0, 0.05392822153713407, 0.02117981747544019, 0.030378511513675297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 200.58333333333331, 105, 962, 113.0, 774.5000000000007, 962.0, 962.0, 0.053928463892646404, 4.057068006320866, 0.03131783189598997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 161.83333333333331, 102, 726, 112.0, 543.3000000000006, 726.0, 726.0, 0.05392822153713407, 1.3347147056642608, 0.03137035543192011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 112.0, 100, 121, 115.0, 121.0, 121.0, 121.0, 0.022816464360682666, 0.0067290744501232085, 0.014104318301086063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb757de2-14e8-4c7f-ae27-e450ed7acbb2", 1, 0, 0.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 0.16681815558633425, 0.6366141505078486], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1057.7222222222222, 794, 1882, 881.0, 1487.5, 1628.5, 1882.0, 0.2489224883029479, 297.79783546914973, 0.49152467905132874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 892.0833333333334, 260, 2555, 658.0, 2029.0, 2517.0, 2555.0, 0.09578888130560245, 0.029793709663900766, 0.04321724918280111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 161.875, 108, 325, 111.0, 325.0, 325.0, 325.0, 0.053146611571346, 0.014324672650089354, 0.03129629568117348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/763960bb-a089-4b30-9c88-e5c06d9bd081", 3, 0, 0.0, 339.0, 267, 441, 309.0, 441.0, 441.0, 441.0, 0.04212240771682509, 0.027080649492424985, 0.02701209088611505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 136.0, 104, 316, 111.5, 316.0, 316.0, 316.0, 0.053146611571346, 0.014324672650089354, 0.031244394693310838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1de92fd7-dc22-4db9-9992-dfd77d55a187", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 131.05555555555557, 103, 335, 109.0, 301.70000000000005, 335.0, 335.0, 0.1012903262111228, 0.027300908236591693, 0.05954763318271087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 142.88888888888889, 102, 329, 109.0, 320.0, 329.0, 329.0, 0.10128918625393199, 0.027300600982505106, 0.05964587823351659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28524d36-dec8-422b-94a8-7106f65972f9", 3, 0, 0.0, 360.66666666666663, 216, 629, 237.0, 629.0, 629.0, 629.0, 0.023337767509160074, 0.023406139874909568, 0.014965951169611115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 144.66666666666669, 105, 338, 110.5, 324.5, 338.0, 338.0, 0.10128576653630814, 0.07527194173254931, 0.05084070703092029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 135.12500000000003, 103, 325, 109.5, 325.0, 325.0, 325.0, 0.053149083178315175, 0.014221532022322615, 0.03031158650013287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 144.6111111111111, 100, 325, 111.0, 324.1, 325.0, 325.0, 0.10128519660582053, 0.027101702998041818, 0.057764213689257014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 116.375, 105, 157, 112.0, 157.0, 157.0, 157.0, 0.053147670803327045, 0.039497438946613166, 0.02667763944620127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 140.125, 110, 315, 115.0, 315.0, 315.0, 315.0, 0.05352996674450816, 0.0421339386680406, 0.019028230366211884], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 475.9285714285714, 99, 1004, 498.0, 860.0, 1004.0, 1004.0, 0.09299483214432798, 0.01853280102095041, 0.06327877982477118], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/de483e0e-447e-4876-a3e5-db208ac8bf79", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1495.9999999999998, 869, 5303, 1214.0, 2710.4000000000005, 5066.999999999996, 5303.0, 0.0913015690826801, 0.04725569493537153, 0.04199515531049055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 281.0, 213, 482, 224.0, 482.0, 482.0, 482.0, 0.0531074496474993, 0.08230617440486464, 0.11943989896307704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/711d77c2-c7ca-4d18-876b-e51e84a9e7ec", 3, 0, 0.0, 450.0, 227, 566, 557.0, 566.0, 566.0, 566.0, 0.021861109086934342, 0.021925155304962474, 0.014019005501712454], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1141.4262295081971, 552, 4039, 886.0, 2278.800000000003, 3485.199999999999, 4039.0, 0.28884216906263616, 74.75955683591161, 1.0529717597590773], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=175c0588-6944-4715-a6d3-afae915c00fc", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 200.88888888888889, 100, 588, 113.0, 447.5, 458.75, 588.0, 0.250478924981562, 0.18614693545993033, 0.12108112096276678], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 607.7037037037038, 492, 885, 544.0, 770.5, 808.0, 885.0, 0.2503894947696417, 73.62282517596817, 0.12592831035777877], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 179.77777777777774, 103, 444, 112.5, 333.0, 343.5, 444.0, 0.2506416891393243, 0.4435183014848199, 0.12189410272596045], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 852.0925925925926, 685, 1766, 764.0, 1073.5, 1200.75, 1766.0, 0.24945604723034498, 224.4609897948224, 0.12521524245741925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 114.66666666666667, 101, 143, 113.0, 129.20000000000002, 143.0, 143.0, 0.1341261680153798, 0.1002016782536773, 0.04767766128671704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, 7.386363636363637, 215.52840909090907, 101, 2658, 116.0, 296.90000000000003, 390.7000000000001, 2609.4899999999993, 0.7363308133526899, 1.5246391691385348, 0.355920736445865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 131.41666666666669, 108, 310, 114.0, 257.8000000000002, 310.0, 310.0, 0.05316886431305828, 0.04117471621118673, 0.018899869736282434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 126.9230769230769, 104, 188, 117.0, 180.79999999999998, 188.0, 188.0, 0.094181059464472, 0.07643013712400022, 0.03347842348151153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 331.9166666666667, 214, 1072, 228.5, 885.7000000000007, 1072.0, 1072.0, 0.05389867049946101, 5.450033721759342, 0.12007016652443407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=711d77c2-c7ca-4d18-876b-e51e84a9e7ec", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb1d50ec-b045-4083-8118-0aaeacf9563f", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 316.33333333333337, 217, 668, 223.5, 641.0, 668.0, 668.0, 0.10122197416590281, 0.15687429004032008, 0.22765059228913495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5903fa36-e7ff-42cf-a9c7-5ccc01fc49f8", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 140.5333333333333, 105, 336, 111.0, 330.6, 336.0, 336.0, 0.07274808308801063, 0.06031554935714944, 0.025859670160191278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 126.75, 108, 334, 114.5, 144.00000000000006, 324.59999999999985, 334.0, 0.10265622994995509, 0.0796989285255999, 0.0364910817400231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f68105d-225b-4bb0-ba9f-e5b4028bf9e7", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 138.26666666666668, 101, 329, 113.0, 310.40000000000003, 329.0, 329.0, 0.12962882945167004, 0.09633548751242275, 0.06506759603335782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 234.13333333333335, 102, 445, 311.0, 383.80000000000007, 445.0, 445.0, 0.12962322848254407, 0.04766354130660214, 0.073199992438645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 211.26666666666668, 99, 754, 110.0, 533.2000000000002, 754.0, 754.0, 0.12963106997485158, 7.8087612914063245, 0.07546621274186997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 237.40000000000006, 101, 766, 113.0, 508.60000000000014, 766.0, 766.0, 0.1296344309048483, 2.5737329584737707, 0.07559476546970875], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.6880733944954128], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.3058103975535168], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.22935779816513763], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.452599388379205], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 35, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
