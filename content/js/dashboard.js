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

    var data = {"OkPercent": 97.05438066465257, "KoPercent": 2.945619335347432};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.791452442159383, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8058fe4d-288c-4189-ab11-cd26e443eae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725634dc-30cd-45f1-9295-50b0c4eab8c1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9163e4eb-afc2-46ae-bb94-3eca681eee3d"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/251f07f6-3659-4068-ac39-8d5fdb70fe29"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7fcd9c2-a3a6-4241-a42b-822a3e285e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5aceab5a-a9f4-4fc9-8f93-b6668c66ca91"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7da8a584-3dc0-444d-8cc1-666809cea5ba"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ee98f04-9f85-4526-9681-eea29796d26d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c113da1-3ae9-4f1a-ab18-0fa3e6f03b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a686276d-b8de-4a45-bcb6-f1a959a730eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bd0a28d-43ad-4a18-9840-18eb17614dcf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ddf6d817-044a-4f61-aa9a-ced9fc468f42"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4c24b20-8098-4595-ba94-e9e5d5e401fc"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bfd1cb6-57ec-4265-b18f-e8a31437f2d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8058fe4d-288c-4189-ab11-cd26e443eae2"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9163e4eb-afc2-46ae-bb94-3eca681eee3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a686276d-b8de-4a45-bcb6-f1a959a730eb"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7fcd9c2-a3a6-4241-a42b-822a3e285e4b"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=251f07f6-3659-4068-ac39-8d5fdb70fe29"], "isController": false}, {"data": [0.9075144508670521, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bd0a28d-43ad-4a18-9840-18eb17614dcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9407006b-f5b5-4d1f-b7d8-e2e3204e2e3a"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddf6d817-044a-4f61-aa9a-ced9fc468f42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5aceab5a-a9f4-4fc9-8f93-b6668c66ca91"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ee98f04-9f85-4526-9681-eea29796d26d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7da8a584-3dc0-444d-8cc1-666809cea5ba"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8c113da1-3ae9-4f1a-ab18-0fa3e6f03b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/725634dc-30cd-45f1-9295-50b0c4eab8c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4c24b20-8098-4595-ba94-e9e5d5e401fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad8372c3-ef2f-4c2e-b030-fc696310f100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 39, 2.945619335347432, 329.0981873111778, 97, 2686, 113.5, 813.0, 997.25, 1490.0, 5.268666159962116, 746.0632636320271, 3.8412124149910265], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1489.0727272727272, 1193, 2297, 1450.0, 1748.3999999999999, 1785.8, 2297.0, 0.24891270405184623, 299.52616779657944, 1.2239018211924275], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8058fe4d-288c-4189-ab11-cd26e443eae2", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725634dc-30cd-45f1-9295-50b0c4eab8c1", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9163e4eb-afc2-46ae-bb94-3eca681eee3d", 3, 0, 0.0, 947.6666666666666, 331, 2034, 478.0, 2034.0, 2034.0, 2034.0, 0.024890688393472, 0.024963610332124752, 0.01596180212732417], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 538.7058823529412, 102, 1296, 427.0, 1090.3999999999999, 1296.0, 1296.0, 0.09233810956731449, 0.019164613388482722, 0.06172140641804178], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 538.7058823529412, 102, 1296, 427.0, 1090.3999999999999, 1296.0, 1296.0, 0.09271934943741171, 0.019243739057753246, 0.06197623793966698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 160.0, 99, 302, 106.0, 298.8, 302.0, 302.0, 0.1098766150246576, 0.048815816900316056, 0.06157836949566634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 115.41176470588235, 98, 323, 103.0, 154.19999999999985, 323.0, 323.0, 0.10987590486039296, 0.08165582382691314, 0.05515255380687694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 246.88235294117646, 98, 813, 294.0, 552.9999999999998, 813.0, 813.0, 0.1098766150246576, 3.8269984617273898, 0.0635918483670396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 229.1764705882353, 100, 877, 104.0, 723.3999999999999, 877.0, 877.0, 0.1098766150246576, 11.657562964955824, 0.06348454698517958], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 273.3157894736842, 100, 1089, 208.0, 495.0, 1089.0, 1089.0, 0.09570727677536998, 0.1429607770171568, 0.061848663183425516], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 112.10526315789473, 99, 300, 101.0, 106.0, 300.0, 300.0, 0.09642320652835858, 0.07165826188289148, 0.048399929839429985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 122.78947368421053, 98, 303, 101.0, 292.0, 303.0, 303.0, 0.09642271719217047, 0.02580060987368624, 0.05499108089865972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 582.8571428571429, 486, 704, 507.0, 704.0, 704.0, 704.0, 0.045675210105966486, 13.430028330864697, 0.02604914326355901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 774.4285714285714, 678, 905, 706.0, 905.0, 905.0, 905.0, 0.045557493556868764, 40.992712784002165, 0.025937518304350093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 215.71428571428572, 100, 305, 299.0, 305.0, 305.0, 305.0, 0.045790540982534184, 0.08102779322299994, 0.02535472337607117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 120.30769230769232, 99, 300, 103.0, 234.79999999999995, 300.0, 300.0, 0.06491528555235418, 0.048242707329435086, 0.03258443044327153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 161.53846153846155, 97, 305, 101.0, 304.6, 305.0, 305.0, 0.06485343124538542, 0.024846191357531976, 0.03656774751561471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 207.76923076923077, 100, 688, 103.0, 534.7999999999998, 688.0, 688.0, 0.064915933865644, 4.509341067380243, 0.0377343371583799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 147.53846153846155, 98, 495, 102.0, 418.19999999999993, 495.0, 495.0, 0.064915933865644, 1.484415572458666, 0.03779773162504557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 159.14285714285714, 98, 308, 105.0, 308.0, 308.0, 308.0, 0.045790540982534184, 0.03402988446065284, 0.025712461977497218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 621.0, 100, 909, 789.0, 900.5, 909.0, 909.0, 0.0774229227153325, 49.76687793792341, 0.04076368726669432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 112.73684210526316, 97, 296, 100.0, 136.0, 296.0, 296.0, 0.09642467456672334, 0.02598946306681215, 0.05668716219645259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 531.9285714285714, 100, 789, 684.0, 757.5, 789.0, 789.0, 0.07734122950457417, 16.249448425829762, 0.04079620378861537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 114.42105263157896, 99, 302, 102.0, 146.0, 302.0, 302.0, 0.09642418521563492, 0.025989331171401602, 0.05678103875491002], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 354.88235294117646, 102, 824, 383.0, 721.5999999999999, 824.0, 824.0, 0.09282110642758862, 0.019264858543363836, 0.06243883020835608], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/251f07f6-3659-4068-ac39-8d5fdb70fe29", 3, 0, 0.0, 273.6666666666667, 199, 414, 208.0, 414.0, 414.0, 414.0, 0.02832272804516531, 0.0334765057070297, 0.018162686930005098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 345.07692307692304, 205, 790, 208.0, 716.4, 790.0, 790.0, 0.06481947775445385, 6.05785543511321, 0.1445047807481165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7fcd9c2-a3a6-4241-a42b-822a3e285e4b", 3, 0, 0.0, 278.0, 195, 402, 237.0, 402.0, 402.0, 402.0, 0.06313662766226112, 0.028567679834161124, 0.04048800667143699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5aceab5a-a9f4-4fc9-8f93-b6668c66ca91", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 586.2173913043478, 145, 2130, 494.0, 1232.0000000000007, 1986.3999999999978, 2130.0, 0.09787858799497841, 0.06012268735238419, 0.04425565062663574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 101.85714285714285, 99, 106, 102.0, 105.5, 106.0, 106.0, 0.0774229227153325, 0.05753793377575004, 0.038862678003594636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 171.5, 99, 306, 102.0, 303.0, 306.0, 306.0, 0.0773390932543738, 0.10366545870368632, 0.03946796918589556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7da8a584-3dc0-444d-8cc1-666809cea5ba", 3, 0, 0.0, 267.6666666666667, 190, 417, 196.0, 417.0, 417.0, 417.0, 0.07072969468348461, 0.045472378580690795, 0.045357258634916894], "isController": false}, {"data": ["login", 23, 0, 0.0, 2576.3043478260875, 1146, 4524, 2548.0, 3900.4000000000005, 4444.399999999999, 4524.0, 0.10003784040049932, 36.559808254915986, 0.20142214799728592], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 106.78947368421052, 101, 133, 105.0, 116.0, 133.0, 133.0, 0.0941829627977297, 0.0762477306243339, 0.033479100057005474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ee98f04-9f85-4526-9681-eea29796d26d", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c113da1-3ae9-4f1a-ab18-0fa3e6f03b61", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a686276d-b8de-4a45-bcb6-f1a959a730eb", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bd0a28d-43ad-4a18-9840-18eb17614dcf", 3, 0, 0.0, 293.0, 198, 428, 253.0, 428.0, 428.0, 428.0, 0.06187735907431471, 0.028723018893220306, 0.039680467895963537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddf6d817-044a-4f61-aa9a-ced9fc468f42", 3, 0, 0.0, 792.6666666666667, 196, 1776, 406.0, 1776.0, 1776.0, 1776.0, 0.057433855343263014, 0.02598732386951028, 0.03683095541218363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 745.9285714285714, 204, 1011, 935.0, 1004.5, 1011.0, 1011.0, 0.07729553949526012, 66.08589622107628, 0.15971320249222903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 410.4117647058823, 203, 977, 397.0, 928.1999999999999, 977.0, 977.0, 0.10980280707646797, 15.604544433401367, 0.2436439010192284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 9, 56.25, 466.87500000000006, 98, 1202, 103.0, 1193.6, 1202.0, 1202.0, 0.10406301015264742, 54.48246080970778, 0.14133362438456487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4c24b20-8098-4595-ba94-e9e5d5e401fc", 3, 0, 0.0, 911.6666666666667, 387, 1259, 1089.0, 1259.0, 1259.0, 1259.0, 0.06089145084030202, 0.03914733574531136, 0.039048228566209306], "isController": false}, {"data": ["register", 25, 7, 28.0, 1042.2, 147, 2294, 941.0, 1509.2, 2067.1999999999994, 2294.0, 0.09740247090588194, 0.030620901791036638, 0.04394525542823971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bfd1cb6-57ec-4265-b18f-e8a31437f2d0", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 144.19047619047618, 101, 308, 106.0, 304.4, 307.7, 308.0, 0.0944138473642801, 0.07329981313926043, 0.03356117230527144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 249.31578947368422, 202, 602, 206.0, 404.0, 602.0, 602.0, 0.09637283097727123, 0.14935906519622014, 0.216744755606109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 330.46666666666664, 201, 984, 210.0, 693.0000000000002, 984.0, 984.0, 0.09324183201551545, 7.571515999521358, 0.20811261243410908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 137.11111111111111, 99, 416, 103.0, 416.0, 416.0, 416.0, 0.04911939834194742, 0.03650377161935741, 0.024655635495860327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 143.22222222222223, 99, 298, 100.0, 298.0, 298.0, 298.0, 0.04911966642288758, 0.013143348242061717, 0.028013559756803075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 155.77777777777777, 98, 410, 99.0, 410.0, 410.0, 410.0, 0.04911966642288758, 0.013239285090543918, 0.028876991393142894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 144.77777777777774, 98, 299, 103.0, 299.0, 299.0, 299.0, 0.04911939834194742, 0.013239212834353016, 0.02892480195331474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 106.25, 102, 113, 105.0, 113.0, 113.0, 113.0, 0.056042816711967945, 0.016528252584974923, 0.034643655252612995], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 965.6181818181819, 777, 1841, 813.0, 1305.0, 1369.2, 1841.0, 0.24906713038437847, 297.9708776842644, 0.49181029066134113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8058fe4d-288c-4189-ab11-cd26e443eae2", 3, 0, 0.0, 313.3333333333333, 258, 386, 296.0, 386.0, 386.0, 386.0, 0.027180314204432204, 0.032126211222751735, 0.01743008430427456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1042.2, 147, 2294, 941.0, 1509.2, 2067.1999999999994, 2294.0, 0.10224572510623331, 0.0321434998302721, 0.046130395506913856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 100.66666666666667, 99, 104, 100.0, 104.0, 104.0, 104.0, 0.03471740036106096, 0.009357424316067212, 0.020443937907929453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 99.66666666666667, 98, 102, 99.5, 102.0, 102.0, 102.0, 0.03471760124520463, 0.00935747846062156, 0.02041015229454413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9163e4eb-afc2-46ae-bb94-3eca681eee3d", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.21925250303398058, 0.8367149575242719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a686276d-b8de-4a45-bcb6-f1a959a730eb", 3, 0, 0.0, 400.0, 350, 437, 413.0, 437.0, 437.0, 437.0, 0.017813351700878197, 0.024557143376698946, 0.011423275667555355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 186.47619047619048, 97, 914, 101.0, 772.2000000000005, 911.6999999999999, 914.0, 0.09676259987282629, 8.315706917028374, 0.056093869513330195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 191.80952380952382, 98, 807, 102.0, 624.8000000000003, 796.7999999999998, 807.0, 0.09676170816668817, 2.7332302744346353, 0.05618784644147299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 111.9047619047619, 98, 297, 102.0, 111.4, 278.4999999999998, 297.0, 0.09675992480371558, 0.07190849880432379, 0.04856894662999005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 133.16666666666669, 99, 293, 101.5, 293.0, 293.0, 293.0, 0.03467827232847259, 0.00927914708789208, 0.019777452187332026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 129.90476190476193, 98, 306, 102.0, 304.0, 306.0, 306.0, 0.09676170816668817, 0.03973241643935345, 0.054410462014118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 102.16666666666666, 100, 108, 101.0, 108.0, 108.0, 108.0, 0.03471699859974772, 0.02580042571719533, 0.017426305937763995], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 525.9411764705882, 98, 2034, 413.0, 1827.6, 2034.0, 2034.0, 0.09328614152056411, 0.01876118919252613, 0.0634750888276127], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 191.5, 105, 406, 108.5, 406.0, 406.0, 406.0, 0.03641749010658185, 0.028664547876860326, 0.012945279686324019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1382.6086956521738, 752, 2686, 1207.0, 2362.800000000001, 2669.2, 2686.0, 0.09944010895177155, 0.051468025141053635, 0.04573856573855899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 236.66666666666666, 202, 394, 205.5, 394.0, 394.0, 394.0, 0.034658040665434375, 0.05371319388285582, 0.07794674575439002], "isController": false}, {"data": ["addBook", 59, 15, 25.423728813559322, 927.6610169491528, 510, 2032, 836.0, 1420.0, 1498.0, 2032.0, 0.28490166063866257, 93.58570149036163, 1.033056175424576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7fcd9c2-a3a6-4241-a42b-822a3e285e4b", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 190.78181818181827, 100, 708, 104.0, 411.8, 461.59999999999997, 708.0, 0.24985008994603236, 0.1856796078602838, 0.12077714308914651], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 550.8363636363637, 486, 817, 497.0, 708.6, 800.8, 817.0, 0.25012051261062146, 73.54373549016799, 0.12579303124459967], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 164.7272727272727, 99, 411, 104.0, 307.2, 332.3999999999998, 411.0, 0.2505774671629619, 0.44340465869070994, 0.12186286977261235], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 772.5454545454544, 675, 1101, 705.0, 914.2, 936.8, 1101.0, 0.2499045818869159, 224.86458206724478, 0.12544038582995584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 124.2, 101, 310, 107.0, 223.00000000000006, 310.0, 310.0, 0.10022249393653912, 0.07487324986469963, 0.03562596464150414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=251f07f6-3659-4068-ac39-8d5fdb70fe29", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, 8.670520231213873, 154.98843930635834, 100, 833, 107.0, 290.59999999999997, 309.59999999999997, 629.4999999999975, 0.7074883346215346, 1.560478399368986, 0.33921516080023884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 127.66666666666667, 100, 309, 104.0, 309.0, 309.0, 309.0, 0.04758078159363898, 0.03684722637085519, 0.016913480957113855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 109.47058823529413, 101, 123, 107.0, 121.4, 123.0, 123.0, 0.108936650133928, 0.08840464478642009, 0.03872357485229472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bd0a28d-43ad-4a18-9840-18eb17614dcf", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9407006b-f5b5-4d1f-b7d8-e2e3204e2e3a", 2, 0, 0.0, 449.5, 404, 495, 449.5, 495.0, 495.0, 495.0, 0.019665103290955034, 0.027999727146691838, 0.01222347484833289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 316.8888888888889, 200, 716, 207.0, 716.0, 716.0, 716.0, 0.04909260501726423, 0.07608394937734213, 0.11041041929175735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddf6d817-044a-4f61-aa9a-ced9fc468f42", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5aceab5a-a9f4-4fc9-8f93-b6668c66ca91", 3, 0, 0.0, 384.6666666666667, 301, 439, 414.0, 439.0, 439.0, 439.0, 0.08357942831671031, 0.03781751476569901, 0.053597484955702906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 328.57142857142856, 198, 1015, 207.0, 916.6000000000003, 1013.0, 1015.0, 0.09671580750790996, 11.155208613981882, 0.21515938966568568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ee98f04-9f85-4526-9681-eea29796d26d", 3, 0, 0.0, 652.0, 274, 1271, 411.0, 1271.0, 1271.0, 1271.0, 0.021613521418999727, 0.021676842282531954, 0.013860233462053862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7da8a584-3dc0-444d-8cc1-666809cea5ba", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c113da1-3ae9-4f1a-ab18-0fa3e6f03b61", 3, 0, 0.0, 611.3333333333334, 201, 1008, 625.0, 1008.0, 1008.0, 1008.0, 0.027105168052041922, 0.02259646334026021, 0.017381894877123237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 107.23076923076923, 101, 116, 107.0, 114.0, 116.0, 116.0, 0.06615843418253621, 0.054852061153294183, 0.02351725590082342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/725634dc-30cd-45f1-9295-50b0c4eab8c1", 3, 0, 0.0, 298.0, 230, 433, 231.0, 433.0, 433.0, 433.0, 0.05335609860207022, 0.034615463708960265, 0.03421598771031196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 104.57142857142857, 100, 112, 103.0, 110.0, 112.0, 112.0, 0.07739381844515819, 0.06008602115615309, 0.027511083900427325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4c24b20-8098-4595-ba94-e9e5d5e401fc", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 101.46666666666665, 98, 109, 101.0, 106.0, 109.0, 109.0, 0.09330040865578992, 0.069337510729547, 0.0468324316885508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad8372c3-ef2f-4c2e-b030-fc696310f100", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 127.86666666666669, 99, 297, 102.0, 295.2, 297.0, 297.0, 0.09329982832831588, 0.034307124374891154, 0.052687676492175255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 193.20000000000002, 98, 882, 103.0, 535.8000000000002, 882.0, 882.0, 0.09330040865578992, 5.6202623315927625, 0.05431590196615062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 199.26666666666665, 97, 492, 101.0, 435.6, 492.0, 492.0, 0.09329982832831588, 1.8523538963563309, 0.05440667723546389], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 17.94871794871795, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.820512820512821, 0.3776435045317221], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.3021148036253776], "isController": false}, {"data": ["401/Unauthorized", 23, 58.97435897435897, 1.7371601208459215], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 39, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
