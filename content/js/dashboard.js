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

    var data = {"OkPercent": 99.39439818319455, "KoPercent": 0.6056018168054504};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7545811518324608, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b46d693-7535-4154-b8b2-c6b5eafde582"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c7ae7eae-aa34-48e7-bf50-8a2c1c31e502"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0a84c8b7-b394-47c5-ab6f-936246312b03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6398fb81-c85d-4964-8120-c1e82b71da3a"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6397ec6c-5638-471a-ad81-94be552d6a5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d78b5515-6618-4672-8212-f38be9ca93aa"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/397d9488-f956-456e-8b8f-9eef2cdb1155"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae6d41a-8efe-4831-88df-1218ecad5308"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c68e8ac-f528-4ce1-be59-7244a5515e22"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e97b9e16-3db0-4c21-b549-bfe238279b3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44cab6d5-a015-4982-88d4-615b13cb7252"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ff7fa28-3d55-4963-ba71-f81f00264854"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fe7d466-f802-458e-8490-89ae0ca76b97"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=967acd44-b575-4a43-ae05-eed00fbd1afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e97b9e16-3db0-4c21-b549-bfe238279b3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6398fb81-c85d-4964-8120-c1e82b71da3a"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3203125, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d78b5515-6618-4672-8212-f38be9ca93aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24895b49-9370-4d44-8d10-1f561748e778"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7ae7eae-aa34-48e7-bf50-8a2c1c31e502"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9510869565217391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24895b49-9370-4d44-8d10-1f561748e778"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6397ec6c-5638-471a-ad81-94be552d6a5a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c68e8ac-f528-4ce1-be59-7244a5515e22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff7fa28-3d55-4963-ba71-f81f00264854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ae0959a-9ac5-48b6-ba43-646b2ac5da3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cae6d41a-8efe-4831-88df-1218ecad5308"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/967acd44-b575-4a43-ae05-eed00fbd1afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44cab6d5-a015-4982-88d4-615b13cb7252"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=397d9488-f956-456e-8b8f-9eef2cdb1155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 8, 0.6056018168054504, 455.33080999243015, 131, 2676, 155.0, 1279.7999999999993, 1585.4999999999993, 2065.499999999999, 5.304283580411494, 723.999354782689, 3.881303040326207], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9b46d693-7535-4154-b8b2-c6b5eafde582", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2210.3392857142862, 1660, 3096, 2198.0, 2680.1, 2780.0499999999997, 3096.0, 0.2552124871824086, 307.10587686567163, 1.2548778056283467], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7ae7eae-aa34-48e7-bf50-8a2c1c31e502", 3, 0, 0.0, 877.0, 343, 1742, 546.0, 1742.0, 1742.0, 1742.0, 0.017806479184225833, 0.02454766905768112, 0.011418868487280237], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 679.1666666666667, 466, 1149, 534.5, 1126.2, 1149.0, 1149.0, 0.08509008913186836, 0.01537272118105044, 0.057834669956816784], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 679.1666666666667, 466, 1149, 534.5, 1126.2, 1149.0, 1149.0, 0.08569837030265808, 0.015482615728507561, 0.058248111065087906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 193.42857142857142, 131, 415, 136.0, 408.0, 415.0, 415.0, 0.11975740571242825, 0.04489231991480116, 0.06758073466891354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a84c8b7-b394-47c5-ab6f-936246312b03", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.6025206367924528, 1.1258107311320753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 155.64285714285714, 133, 404, 136.0, 272.5, 404.0, 404.0, 0.11976252801587708, 0.08900320685554929, 0.06011517519546956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 239.71428571428572, 134, 798, 136.0, 600.5, 798.0, 798.0, 0.11976252801587708, 2.5452711712347518, 0.06978907359407346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 230.3571428571429, 132, 1458, 136.0, 799.0, 1458.0, 1458.0, 0.11976150352013276, 7.7272317475983545, 0.06967152199762187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6398fb81-c85d-4964-8120-c1e82b71da3a", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 382.75, 231, 1742, 252.0, 1330.1000000000015, 1742.0, 1742.0, 0.08549017931565112, 0.20408971437374884, 0.05526806514351664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6397ec6c-5638-471a-ad81-94be552d6a5a", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 186.52941176470588, 133, 413, 139.0, 410.6, 413.0, 413.0, 0.07747274782164862, 0.05757496200417442, 0.038887687871413466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 199.58823529411765, 132, 413, 137.0, 412.2, 413.0, 413.0, 0.077473807017304, 0.03441994620127695, 0.043418799475001026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 857.0, 716, 1060, 795.0, 1060.0, 1060.0, 1060.0, 0.0351708129147225, 10.341386777825974, 0.020058354240427678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1492.0, 1459, 1524, 1493.0, 1524.0, 1524.0, 1524.0, 0.03489914148111956, 31.402308850858518, 0.019869335433098344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 314.6666666666667, 134, 411, 399.0, 411.0, 411.0, 411.0, 0.03532986315566338, 0.06251729691216996, 0.019562531649669077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 210.0, 134, 415, 139.0, 412.0, 415.0, 415.0, 0.07787151200519143, 0.05787130921479559, 0.03908784879948086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 247.33333333333337, 133, 462, 138.0, 435.0, 462.0, 462.0, 0.0777665448324131, 0.028595406589418566, 0.04391582095549162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 333.2666666666667, 133, 1474, 137.0, 857.2000000000004, 1474.0, 1474.0, 0.07787232054323731, 4.690899816286217, 0.045334263691251826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 287.06666666666666, 133, 825, 139.0, 571.2000000000002, 825.0, 825.0, 0.0777657384893746, 1.543943555682861, 0.045348158831336485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 136.0, 135, 138, 135.0, 138.0, 138.0, 138.0, 0.03544507195349607, 0.026341503668564945, 0.01990323864576195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 311.52941176470586, 133, 1464, 138.0, 1267.9999999999998, 1464.0, 1464.0, 0.07747521932323116, 8.219876879913409, 0.04476365785575937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 968.8125, 134, 1727, 1277.5, 1664.0, 1727.0, 1727.0, 0.09897254130557154, 55.66979522349237, 0.052869121185691044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 301.47058823529414, 134, 1085, 138.0, 1064.2, 1085.0, 1085.0, 0.07747521932323116, 2.69845904067449, 0.04483931724962971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 721.0000000000001, 132, 1101, 1060.5, 1090.5, 1101.0, 1101.0, 0.0989756025139803, 18.19882478070718, 0.05296741228287227], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 682.0, 253, 1561, 556.5, 1404.1000000000006, 1561.0, 1561.0, 0.08569347444192126, 0.015481731222417415, 0.05908163374609024], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 599.6666666666667, 272, 1889, 539.0, 1242.2000000000003, 1889.0, 1889.0, 0.07771054376657825, 6.310328880735038, 0.17344730286130222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d78b5515-6618-4672-8212-f38be9ca93aa", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 664.7894736842106, 190, 1625, 528.0, 1425.0, 1625.0, 1625.0, 0.08632832023263211, 0.05302784514289609, 0.03903321510518424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.0625, 134, 164, 137.0, 154.9, 164.0, 164.0, 0.09895540203724433, 0.07354009858431929, 0.049670973288226165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 202.93750000000003, 134, 406, 136.5, 403.2, 406.0, 406.0, 0.0989743780078932, 0.11939267620532236, 0.05125113665887244], "isController": false}, {"data": ["login", 19, 0, 0.0, 3072.5789473684204, 2034, 5503, 2702.0, 4972.0, 5503.0, 5503.0, 0.0882284652890643, 16.789678321627584, 0.1562182566171349], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 160.17647058823528, 136, 428, 141.0, 216.7999999999998, 428.0, 428.0, 0.07913233719685332, 0.06406319095331192, 0.028129072987943954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1110.375, 273, 1871, 1421.0, 1801.7, 1871.0, 1871.0, 0.09887101657943359, 73.98502963426994, 0.2065525607593294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/397d9488-f956-456e-8b8f-9eef2cdb1155", 3, 0, 0.0, 339.3333333333333, 250, 497, 271.0, 497.0, 497.0, 497.0, 0.029247747923409898, 0.02955241196427875, 0.01875588001598877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae6d41a-8efe-4831-88df-1218ecad5308", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 463.99999999999994, 272, 1593, 277.0, 1198.5, 1593.0, 1593.0, 0.11961926895538201, 10.394018328982895, 0.26684041721492163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c68e8ac-f528-4ce1-be59-7244a5515e22", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1629.0, 1595, 1663, 1629.0, 1663.0, 1663.0, 1663.0, 0.03484401495969709, 41.68555563137355, 0.07856917045111385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e97b9e16-3db0-4c21-b549-bfe238279b3e", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44cab6d5-a015-4982-88d4-615b13cb7252", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff7fa28-3d55-4963-ba71-f81f00264854", 3, 0, 0.0, 360.3333333333333, 271, 531, 279.0, 531.0, 531.0, 531.0, 0.018436691474259304, 0.025416467576005262, 0.011823008530042589], "isController": false}, {"data": ["register", 20, 3, 15.0, 1471.75, 242, 2243, 1447.5, 2152.2000000000003, 2239.0499999999997, 2243.0, 0.08393557105565767, 0.026770856940212695, 0.037869368972376805], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5fe7d466-f802-458e-8490-89ae0ca76b97", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 569.9411764705883, 273, 1630, 291.0, 1606.0, 1630.0, 1630.0, 0.07742440872800804, 11.003112382952512, 0.17179874976658818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 158.94117647058826, 136, 412, 142.0, 211.19999999999982, 412.0, 412.0, 0.12493661304191256, 0.09699668688312549, 0.04441106166724236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 428.66666666666674, 269, 827, 411.5, 593.9000000000003, 827.0, 827.0, 0.0823022687992099, 0.1275524419769005, 0.18509973148884806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=967acd44-b575-4a43-ae05-eed00fbd1afb", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 154.9375, 135, 400, 139.0, 226.40000000000018, 400.0, 400.0, 0.07986821744122198, 0.05935518893825188, 0.04009010133280087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e97b9e16-3db0-4c21-b549-bfe238279b3e", 3, 0, 0.0, 408.6666666666667, 363, 494, 369.0, 494.0, 494.0, 494.0, 0.01998561036054041, 0.027551777303674686, 0.012816293102299677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 170.625, 133, 402, 139.0, 399.2, 402.0, 402.0, 0.07987379939695283, 0.02887040039238004, 0.045133766773497876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 227.9375, 134, 1325, 137.5, 680.3000000000006, 1325.0, 1325.0, 0.07976867085452188, 4.506155781047462, 0.04646680875461162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 194.5625, 134, 801, 136.5, 520.3000000000003, 801.0, 801.0, 0.07987340065995398, 1.4880223439598237, 0.046605817279611814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6398fb81-c85d-4964-8120-c1e82b71da3a", 3, 0, 0.0, 431.6666666666667, 231, 536, 528.0, 536.0, 536.0, 536.0, 0.018115285678055145, 0.024973383739115732, 0.011616898693284061], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1489.9107142857147, 1064, 2531, 1373.0, 2127.7, 2200.9499999999994, 2531.0, 0.25765369503004426, 308.24339417334573, 0.5087654017097163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1471.75, 242, 2243, 1447.5, 2152.2000000000003, 2239.0499999999997, 2243.0, 0.08280304880825712, 0.02640964427810232, 0.03735840678653788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 176.14285714285714, 134, 409, 139.0, 409.0, 409.0, 409.0, 0.040660559837822456, 0.010959291518788083, 0.02394366951387396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 136.28571428571428, 133, 141, 135.0, 141.0, 141.0, 141.0, 0.04072585102483695, 0.010976889534038085, 0.023942346012648285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 237.41176470588235, 132, 1322, 137.0, 585.9999999999993, 1322.0, 1322.0, 0.12608282900201734, 6.7054872568270145, 0.07348554590156639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 287.47058823529414, 133, 839, 141.0, 498.9999999999997, 839.0, 839.0, 0.12584109970316307, 2.208479492527259, 0.07346754918906515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 175.14285714285714, 134, 412, 136.0, 412.0, 412.0, 412.0, 0.04072537714608193, 0.010897220056666452, 0.02322619165362485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 155.1176470588235, 133, 414, 139.0, 201.99999999999983, 414.0, 414.0, 0.12582992235553614, 0.09351227628179981, 0.06316072274486872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 136.57142857142858, 135, 140, 136.0, 140.0, 140.0, 140.0, 0.040725140210839866, 0.030265460644969867, 0.020442111394894234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 251.4705882352941, 132, 439, 140.0, 435.0, 439.0, 439.0, 0.12583923667399494, 0.044789746693018884, 0.07114601145137055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 183.57142857142856, 137, 415, 148.0, 415.0, 415.0, 415.0, 0.04091820450918614, 0.03220710237734768, 0.014545143009124758], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 574.6666666666666, 494, 924, 536.5, 860.4000000000002, 924.0, 924.0, 0.08251335684964003, 0.01490719825896817, 0.05616387668378818], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1742.1052631578948, 1152, 2676, 1699.0, 2215.0, 2676.0, 2676.0, 0.08592813694231508, 0.04447452400334667, 0.039523586425615626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 354.1428571428571, 273, 548, 280.0, 548.0, 548.0, 548.0, 0.040628228493157045, 0.06296581896351584, 0.0913738381052155], "isController": false}, {"data": ["addBook", 64, 5, 7.8125, 1350.265625, 705, 2599, 1102.0, 2201.0, 2402.5, 2599.0, 0.3057811753463927, 92.57786371237458, 1.1137664984472049], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d78b5515-6618-4672-8212-f38be9ca93aa", 3, 0, 0.0, 1154.0, 254, 2496, 712.0, 2496.0, 2496.0, 2496.0, 0.028316846635958622, 0.028399806147587404, 0.018158915323189608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24895b49-9370-4d44-8d10-1f561748e778", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 240.99999999999997, 133, 576, 141.0, 542.5, 556.0, 576.0, 0.2591248982009329, 0.1925723120419042, 0.1252605709076775], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 864.9821428571429, 660, 1325, 800.0, 1199.1000000000001, 1234.2, 1325.0, 0.258861379731154, 76.11384064770816, 0.1301890728140081], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 213.89285714285714, 133, 575, 139.0, 405.3, 415.15, 575.0, 0.2596523440579025, 0.4594629369462102, 0.1262762376375346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7ae7eae-aa34-48e7-bf50-8a2c1c31e502", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1243.071428571429, 924, 1990, 1211.5, 1586.3, 1645.8999999999996, 1990.0, 0.25833594744708727, 232.45113961904676, 0.12967253612090124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 162.44444444444443, 137, 432, 145.0, 203.40000000000038, 432.0, 432.0, 0.08236026208865624, 0.061528906736154326, 0.029276499414327025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 5, 2.717391304347826, 212.71739130434773, 135, 1559, 145.0, 363.5, 477.25, 862.0000000000047, 0.7655757212638656, 1.541614234871558, 0.3721340969327042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 177.0, 136, 426, 140.5, 420.4, 426.0, 426.0, 0.08503130214810327, 0.06584943613617764, 0.030225970685458584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 142.14285714285714, 137, 163, 140.5, 155.0, 163.0, 163.0, 0.1216830504202411, 0.09874864736251988, 0.04325452182907008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24895b49-9370-4d44-8d10-1f561748e778", 3, 0, 0.0, 363.3333333333333, 265, 560, 265.0, 560.0, 560.0, 560.0, 0.042902496925321054, 0.027582171688642278, 0.027512343405886222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 417.8125, 272, 1461, 278.5, 999.0000000000005, 1461.0, 1461.0, 0.0797074735719908, 6.075675902251238, 0.17798935718413422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 506.5882352941177, 275, 1462, 538.0, 943.5999999999996, 1462.0, 1462.0, 0.12545384774330665, 9.011604711529946, 0.2802604943066092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6397ec6c-5638-471a-ad81-94be552d6a5a", 3, 0, 0.0, 408.3333333333333, 235, 511, 479.0, 511.0, 511.0, 511.0, 0.04710167681969478, 0.030557826139860578, 0.030205176866796458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c68e8ac-f528-4ce1-be59-7244a5515e22", 3, 0, 0.0, 421.3333333333333, 240, 554, 470.0, 554.0, 554.0, 554.0, 0.059758575355563524, 0.02703919913549261, 0.038321742659654996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 143.33333333333331, 137, 166, 140.0, 161.8, 166.0, 166.0, 0.07672634271099743, 0.06361393062659847, 0.027273817135549872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff7fa28-3d55-4963-ba71-f81f00264854", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ae0959a-9ac5-48b6-ba43-646b2ac5da3e", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae6d41a-8efe-4831-88df-1218ecad5308", 3, 0, 0.0, 481.0, 236, 924, 283.0, 924.0, 924.0, 924.0, 0.05510147855634126, 0.03542494145467903, 0.03533525805859124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/967acd44-b575-4a43-ae05-eed00fbd1afb", 3, 0, 0.0, 361.3333333333333, 257, 497, 330.0, 497.0, 497.0, 497.0, 0.07062978222483815, 0.03195813713949382, 0.045293187168922895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 161.0625, 137, 416, 141.0, 238.90000000000018, 416.0, 416.0, 0.09305409350773222, 0.07224414486196007, 0.03307782230157668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44cab6d5-a015-4982-88d4-615b13cb7252", 3, 0, 0.0, 335.6666666666667, 230, 542, 235.0, 542.0, 542.0, 542.0, 0.024165679901404027, 0.028563015534504563, 0.015496871551356097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=397d9488-f956-456e-8b8f-9eef2cdb1155", 1, 0, 0.0, 1561.0, 1561, 1561, 1561.0, 1561.0, 1561.0, 1561.0, 0.6406149903907751, 0.11573610666239591, 0.4416740070467649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 154.8888888888889, 133, 404, 138.5, 191.60000000000034, 404.0, 404.0, 0.08246175835956075, 0.06128261534338451, 0.0413919373015764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 227.44444444444446, 133, 422, 138.5, 416.6, 422.0, 422.0, 0.08235536339304096, 0.022036493720403543, 0.04696829318509368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 194.44444444444449, 133, 402, 136.0, 400.2, 402.0, 402.0, 0.0823640307126319, 0.022199680153014066, 0.04842104149316836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 224.2777777777778, 134, 402, 138.0, 402.0, 402.0, 402.0, 0.08246402506906363, 0.022226631756896056, 0.04856035851234899], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 37.5, 0.22710068130204392], "isController": false}, {"data": ["401/Unauthorized", 5, 62.5, 0.3785011355034065], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 8, "401/Unauthorized", 5, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
