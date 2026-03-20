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

    var data = {"OkPercent": 96.57794676806084, "KoPercent": 3.4220532319391634};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7336145360155742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4029b450-1c85-4502-b202-f738ed0f54ce"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40355e59-257c-403e-959c-53d2017ce085"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/312a2ffc-2e85-4e72-b5f1-b9516c39ae30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdc33551-c644-4dfe-86d1-8a749480a8f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b52bc30-583c-4596-a537-1d9b8290dbce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d578ec1-245b-45aa-8229-d5c2d36e02ce"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a650ee3-a141-48bf-adcd-9d3be7a6e415"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e9686e9-6c57-4bcf-ae08-221d8e1f7095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3d66de5-c0e1-4056-b39d-7c0d3b7b5b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9df9869-ba02-4fdb-bf38-f67c1e021066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbbc4830-f0ed-4afd-b837-4592e8fc180f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00e90d4c-162e-4beb-b3f9-9e241abb6ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3bca6d2-109d-424c-8ef6-12789b33d88e"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71893116-4c94-401f-8bb1-b246852742f9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4029b450-1c85-4502-b202-f738ed0f54ce"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71893116-4c94-401f-8bb1-b246852742f9"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdc33551-c644-4dfe-86d1-8a749480a8f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d578ec1-245b-45aa-8229-d5c2d36e02ce"], "isController": false}, {"data": [0.2540983606557377, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cb68d5c-3216-44b2-8a10-8d49cdcdd8b3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3d66de5-c0e1-4056-b39d-7c0d3b7b5b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbbc4830-f0ed-4afd-b837-4592e8fc180f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00e90d4c-162e-4beb-b3f9-9e241abb6ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e9686e9-6c57-4bcf-ae08-221d8e1f7095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40355e59-257c-403e-959c-53d2017ce085"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3bca6d2-109d-424c-8ef6-12789b33d88e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deb92225-2ae9-4498-bb72-9493d0f7251f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 45, 3.4220532319391634, 440.52319391635, 137, 3066, 161.0, 1142.4, 1339.6000000000001, 1923.079999999999, 5.134472418316986, 713.3186070083595, 3.743159120814331], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4029b450-1c85-4502-b202-f738ed0f54ce", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2167.092592592593, 1716, 2684, 2115.0, 2559.0, 2680.25, 2684.0, 0.26079901089560314, 313.82895433481764, 1.2823466990814079], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/40355e59-257c-403e-959c-53d2017ce085", 3, 0, 0.0, 342.6666666666667, 241, 539, 248.0, 539.0, 539.0, 539.0, 0.02935966569127333, 0.02944568033685323, 0.0188276501991564], "isController": false}, {"data": ["deleteBook", 17, 6, 35.294117647058826, 585.5294117647057, 148, 2384, 523.0, 1251.999999999999, 2384.0, 2384.0, 0.10102090538500849, 0.022324645164069835, 0.06695652609904802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 6, 35.294117647058826, 585.5294117647057, 148, 2384, 523.0, 1251.999999999999, 2384.0, 2384.0, 0.10303092746016643, 0.022768840644488756, 0.06828876614403724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 201.0, 141, 449, 151.0, 447.4, 449.0, 449.0, 0.11259172914403794, 0.040074583741754315, 0.06365623840967494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312a2ffc-2e85-4e72-b5f1-b9516c39ae30", 1, 0, 0.0, 2721.0, 2721, 2721, 2721.0, 2721.0, 2721.0, 2721.0, 0.3675119441381845, 0.11735977122381477, 0.21928691198088937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 170.6470588235294, 149, 427, 152.0, 226.19999999999982, 427.0, 427.0, 0.1125850182453956, 0.08366913953588481, 0.056512401736458336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 303.47058823529414, 145, 746, 156.0, 505.9999999999998, 746.0, 746.0, 0.11259172914403794, 1.9759563880904443, 0.06573240712838106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 271.2352941176471, 144, 1342, 150.0, 645.1999999999994, 1342.0, 1342.0, 0.11259322056349595, 5.988066826146133, 0.06562332352006146], "isController": false}, {"data": ["goToProfile", 17, 6, 35.294117647058826, 402.88235294117646, 144, 3066, 238.0, 929.1999999999981, 3066.0, 3066.0, 0.10125979092831403, 0.1263827824850344, 0.06542797152812938], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdc33551-c644-4dfe-86d1-8a749480a8f2", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 170.23529411764707, 144, 450, 151.0, 231.5999999999998, 450.0, 450.0, 0.09018519795650952, 0.06702239809072631, 0.045268741943013564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b52bc30-583c-4596-a537-1d9b8290dbce", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 184.0, 143, 447, 150.0, 434.2, 447.0, 447.0, 0.09018471952552227, 0.040067131250596806, 0.05054240140688162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 948.5, 720, 1089, 1024.0, 1089.0, 1089.0, 1089.0, 0.04971826317533974, 14.618820175256877, 0.028354946967185945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1058.0, 951, 1274, 1026.0, 1274.0, 1274.0, 1274.0, 0.04958267911742831, 44.61458182691513, 0.02822920109908272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 395.0, 148, 450, 449.0, 450.0, 450.0, 450.0, 0.04996710498921543, 0.08841835375044763, 0.027667332547739405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 171.57142857142853, 144, 427, 151.5, 293.0, 427.0, 427.0, 0.06925207756232687, 0.051465655297783935, 0.034761296745152354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 252.6428571428571, 143, 453, 156.0, 448.5, 453.0, 453.0, 0.06925104989538144, 0.018530066085287615, 0.03949473939345973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 190.2142857142857, 142, 440, 149.0, 435.5, 440.0, 440.0, 0.069251392447641, 0.01866541437065324, 0.04071224438816395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 233.3571428571429, 144, 467, 150.0, 457.5, 467.0, 467.0, 0.06925550333910462, 0.018666522384368042, 0.0407822934701954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 239.49999999999997, 147, 429, 149.5, 429.0, 429.0, 429.0, 0.04996627276588303, 0.037133138256676745, 0.02805723324256127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d578ec1-245b-45aa-8229-d5c2d36e02ce", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 306.11764705882354, 142, 1326, 150.0, 1322.8, 1326.0, 1326.0, 0.09018759018759019, 9.56861941035884, 0.0521086157000679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 731.7777777777777, 143, 1401, 736.5, 1395.6, 1401.0, 1401.0, 0.08218690214736112, 36.98703547991443, 0.044785440818581546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 291.2352941176471, 143, 1080, 150.0, 1060.8, 1080.0, 1080.0, 0.09018519795650952, 3.1411471291929485, 0.05219530499838197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 628.0555555555554, 144, 1140, 598.5, 1060.8000000000002, 1140.0, 1140.0, 0.08218690214736112, 12.093915015889467, 0.04486570146520983], "isController": false}, {"data": ["deleteBooks", 16, 6, 37.5, 385.00000000000006, 152, 821, 308.5, 767.1, 821.0, 821.0, 0.10132803049973718, 0.022647903301393896, 0.06715208466590249], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 471.14285714285717, 303, 876, 445.5, 747.5, 876.0, 876.0, 0.06919833726281034, 0.10724390745710938, 0.15562868234009006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a650ee3-a141-48bf-adcd-9d3be7a6e415", 2, 0, 0.0, 321.5, 252, 391, 321.5, 391.0, 391.0, 391.0, 0.061338403974728575, 0.03609022304177145, 0.03812684973624486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 566.9545454545455, 157, 1913, 438.0, 1095.4, 1790.4499999999982, 1913.0, 0.1050344942827815, 0.06451825869518511, 0.047491182473562335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 168.16666666666666, 145, 446, 150.5, 190.4000000000004, 446.0, 446.0, 0.08218540113324536, 0.06107723658437473, 0.04125321892821105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 247.99999999999994, 144, 463, 155.5, 462.1, 463.0, 463.0, 0.08218727740945701, 0.0837122366582653, 0.04342120808448852], "isController": false}, {"data": ["login", 22, 0, 0.0, 2671.9545454545446, 1536, 4527, 2629.5, 4294.299999999999, 4520.85, 4527.0, 0.1056153775989784, 34.603897702505485, 0.2071145308756955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e9686e9-6c57-4bcf-ae08-221d8e1f7095", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 154.58823529411765, 146, 165, 153.0, 161.8, 165.0, 165.0, 0.08870382835287427, 0.07181198603958278, 0.031531438984810777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3d66de5-c0e1-4056-b39d-7c0d3b7b5b61", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9df9869-ba02-4fdb-bf38-f67c1e021066", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbbc4830-f0ed-4afd-b837-4592e8fc180f", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00e90d4c-162e-4beb-b3f9-9e241abb6ca6", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.554184240797546, 2.114886886503067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3bca6d2-109d-424c-8ef6-12789b33d88e", 3, 0, 0.0, 295.0, 226, 426, 233.0, 426.0, 426.0, 426.0, 0.06500541711809317, 0.029413258396533044, 0.04168641657638136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 953.6111111111109, 297, 1553, 1043.0, 1548.5, 1553.0, 1553.0, 0.0821295273901974, 49.19137616435715, 0.1742044272378015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71893116-4c94-401f-8bb1-b246852742f9", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4029b450-1c85-4502-b202-f738ed0f54ce", 3, 0, 0.0, 733.3333333333333, 233, 1706, 261.0, 1706.0, 1706.0, 1706.0, 0.03823896805771535, 0.03187825429551075, 0.024521734073469807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 11, 64.70588235294117, 571.3529411764706, 143, 1515, 157.0, 1504.6, 1515.0, 1515.0, 0.09248177565009248, 39.06554943354912, 0.11315842264171473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 547.0588235294117, 298, 1494, 590.0, 981.9999999999995, 1494.0, 1494.0, 0.11247403173090918, 8.079238162108162, 0.2512639372692628], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 964.6250000000001, 201, 1653, 950.0, 1625.5, 1651.0, 1653.0, 0.09681713663318407, 0.030255355197870024, 0.043681169066924846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 513.4117647058824, 295, 1478, 308.0, 1474.0, 1478.0, 1478.0, 0.09011396766498808, 12.806479633249403, 0.19995589550755366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 158.15384615384613, 150, 166, 160.0, 164.4, 166.0, 166.0, 0.09813913109123165, 0.07619200118899332, 0.03488539425508625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71893116-4c94-401f-8bb1-b246852742f9", 3, 0, 0.0, 364.0, 240, 457, 395.0, 457.0, 457.0, 457.0, 0.03632840881569387, 0.030285499666989586, 0.023296538205376607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 411.84210526315786, 287, 1190, 302.0, 619.0, 1190.0, 1190.0, 0.11835130404450009, 7.62583634272669, 0.264581104513545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 150.375, 144, 159, 151.0, 159.0, 159.0, 159.0, 0.04455906024941934, 0.03311469223614074, 0.022366559539259315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 185.875, 142, 444, 148.5, 444.0, 444.0, 444.0, 0.044558315695666706, 0.020288393254984962, 0.02494438913334076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 347.0, 145, 1463, 149.0, 1463.0, 1463.0, 1463.0, 0.044489675614652675, 5.014478478466997, 0.025677146765878643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 296.5, 143, 734, 157.0, 734.0, 734.0, 734.0, 0.04448448047687363, 1.645480498420801, 0.025717590275692568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 162.66666666666666, 152, 182, 158.5, 182.0, 182.0, 182.0, 0.04290556485176127, 0.012653789634015531, 0.026522678272621957], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1408.2407407407409, 1129, 2075, 1201.0, 1936.0, 2067.5, 2075.0, 0.2637839316506524, 315.57728838666816, 0.5208702244117375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 964.6250000000001, 201, 1653, 950.0, 1625.5, 1651.0, 1653.0, 0.09629852542882937, 0.03009328919650918, 0.04344718627746013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 184.33333333333334, 141, 465, 149.0, 465.0, 465.0, 465.0, 0.051636889393782914, 0.013917755344418052, 0.030407269828565526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 264.3333333333333, 147, 596, 150.0, 596.0, 596.0, 596.0, 0.05163748192688132, 0.013917915050604732, 0.030357191523420465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 373.53846153846155, 143, 1324, 149.0, 1322.4, 1324.0, 1324.0, 0.10098028554117665, 14.001835972090603, 0.058030287288912366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 291.84615384615387, 146, 1042, 151.0, 936.8, 1042.0, 1042.0, 0.10096303199751476, 4.5901774619447036, 0.05811896891503573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 250.11111111111111, 147, 464, 149.0, 464.0, 464.0, 464.0, 0.051638370752026805, 0.013817298423882175, 0.02945000831951529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 175.92307692307693, 149, 446, 153.0, 330.7999999999999, 446.0, 446.0, 0.10121063490209817, 0.07521610660204757, 0.05080299447234225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 200.44444444444446, 148, 602, 151.0, 602.0, 602.0, 602.0, 0.05163659313233312, 0.03837446032588428, 0.025919149287128147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 173.84615384615387, 144, 466, 150.0, 341.5999999999999, 466.0, 466.0, 0.10121378687490754, 0.05047003585303758, 0.05641573757600766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdc33551-c644-4dfe-86d1-8a749480a8f2", 3, 0, 0.0, 642.3333333333334, 238, 1117, 572.0, 1117.0, 1117.0, 1117.0, 0.03463403371045948, 0.028872968858231353, 0.02220997604479335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 188.44444444444446, 150, 443, 156.0, 443.0, 443.0, 443.0, 0.05155731741548896, 0.040581247887582134, 0.018327015175037095], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 467.20000000000005, 143, 1706, 451.0, 1109.6000000000004, 1706.0, 1706.0, 0.09911981603362144, 0.02077902393413158, 0.0674350310905823], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1313.590909090909, 758, 2654, 1174.5, 1972.4, 2551.8499999999985, 2654.0, 0.1043989939733308, 0.05403463555260286, 0.04801945914203009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 503.8888888888889, 299, 1051, 305.0, 1051.0, 1051.0, 1051.0, 0.051591600887375536, 0.07995690489088376, 0.11603071957385337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d578ec1-245b-45aa-8229-d5c2d36e02ce", 3, 0, 0.0, 324.0, 250, 465, 257.0, 465.0, 465.0, 465.0, 0.03776862937643993, 0.03148615228940842, 0.024220117145698782], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 1350.6557377049182, 749, 3030, 1180.0, 2184.0, 2353.3, 3030.0, 0.28050232908901124, 89.14521998596338, 1.0181636394832319], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 273.037037037037, 143, 643, 154.0, 602.0, 607.0, 643.0, 0.26519467253368956, 0.1970831501934939, 0.1281946903361097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cb68d5c-3216-44b2-8a10-8d49cdcdd8b3", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 801.7222222222221, 706, 1203, 737.5, 1038.0, 1090.5, 1203.0, 0.26511394990328246, 77.95230388318294, 0.13333367597674853], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 233.18518518518522, 142, 623, 152.0, 456.0, 503.5, 623.0, 0.26583961010190515, 0.47041149756313694, 0.1292852791315906], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1131.981481481482, 984, 1482, 1043.0, 1383.5, 1435.75, 1482.0, 0.26462416018582496, 238.1092844948619, 0.13282892415577544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 170.05263157894737, 145, 430, 157.0, 166.0, 430.0, 430.0, 0.1168813592686918, 0.08731859359428636, 0.04154767067754279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, 7.954545454545454, 219.44886363636365, 146, 1198, 159.0, 381.6, 452.15, 1007.8099999999974, 0.738038327672244, 1.5844252552731999, 0.35594755105464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 156.375, 152, 160, 155.5, 160.0, 160.0, 160.0, 0.045129408579100576, 0.03494884863596363, 0.016042094455852154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 186.58823529411762, 145, 441, 153.0, 433.0, 441.0, 441.0, 0.1117626949272885, 0.09069804637165697, 0.03972814546243458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3d66de5-c0e1-4056-b39d-7c0d3b7b5b61", 3, 0, 0.0, 577.0, 349, 915, 467.0, 915.0, 915.0, 915.0, 0.018877778966378676, 0.026024542292517477, 0.012105867371017575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbbc4830-f0ed-4afd-b837-4592e8fc180f", 3, 0, 0.0, 376.0, 231, 450, 447.0, 450.0, 450.0, 450.0, 0.0806603393111607, 0.03649670300863066, 0.05172554311295136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 541.25, 294, 1615, 316.0, 1615.0, 1615.0, 1615.0, 0.04444839541292559, 6.707242249658303, 0.09854391570917415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 556.0, 299, 1766, 313.0, 1650.0, 1766.0, 1766.0, 0.10084320433160349, 18.69278632924918, 0.22282924094156523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00e90d4c-162e-4beb-b3f9-9e241abb6ca6", 3, 0, 0.0, 1254.6666666666667, 247, 3066, 451.0, 3066.0, 3066.0, 3066.0, 0.07987220447284345, 0.037024094781682636, 0.05122013112353567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 156.92857142857144, 147, 181, 155.5, 172.5, 181.0, 181.0, 0.07211365111415591, 0.05978954081632653, 0.02563414941948511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e9686e9-6c57-4bcf-ae08-221d8e1f7095", 3, 0, 0.0, 747.3333333333334, 296, 1234, 712.0, 1234.0, 1234.0, 1234.0, 0.031042082716803077, 0.02587850710863694, 0.019906543929720726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 155.94444444444443, 146, 166, 157.5, 161.5, 166.0, 166.0, 0.0835309458951501, 0.06485068553383236, 0.029692640923666636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40355e59-257c-403e-959c-53d2017ce085", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.24282804099462366, 0.9266843077956989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3bca6d2-109d-424c-8ef6-12789b33d88e", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/deb92225-2ae9-4498-bb72-9493d0f7251f", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 149.52631578947367, 144, 159, 149.0, 158.0, 159.0, 159.0, 0.11846272788487916, 0.08803724210975883, 0.059462736457839734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 180.2105263157895, 142, 450, 149.0, 444.0, 450.0, 450.0, 0.11846198928854224, 0.04106227671473729, 0.06703672399603464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 225.26315789473685, 137, 1025, 149.0, 450.0, 1025.0, 1025.0, 0.11846715965632053, 5.640616280583233, 0.0691099024516467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 241.7368421052631, 141, 1040, 148.0, 469.0, 1040.0, 1040.0, 0.11846642100471995, 1.8635688671804367, 0.06922516141049861], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 17.77777777777778, 0.6083650190114068], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 13.333333333333334, 0.45627376425855515], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.11111111111111, 0.38022813688212925], "isController": false}, {"data": ["401/Unauthorized", 26, 57.77777777777778, 1.9771863117870723], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 45, "401/Unauthorized", 26, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
