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

    var data = {"OkPercent": 66.50641025641026, "KoPercent": 33.493589743589745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49649532710280375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e82d656-ac8b-485d-b996-172601dbadee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e24b5f6-c201-4402-9d2f-c427f81d2c6e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31cc434f-8042-4c2b-b3b4-35cf24c275e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5228e5fd-3d67-4186-ada0-a429e6c42c10"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/51366c62-a3c6-4d60-8841-2b5807892261"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31cc434f-8042-4c2b-b3b4-35cf24c275e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51366c62-a3c6-4d60-8841-2b5807892261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/033348a4-6a04-4a3d-97f5-4ccc29c8470f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77152634-9582-47e7-8b94-af19cac4ce1b"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e82d656-ac8b-485d-b996-172601dbadee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82d0d64c-fae6-4920-a302-acb47916475c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1c69026-c45a-4d71-b0da-d585b4705446"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5228e5fd-3d67-4186-ada0-a429e6c42c10"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.84, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ecbacad-bd92-4a9e-8198-29c31cbd3ec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=033348a4-6a04-4a3d-97f5-4ccc29c8470f"], "isController": false}, {"data": [0.06, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bce1f499-4fe1-4e7b-8b8a-92730875524c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82d0d64c-fae6-4920-a302-acb47916475c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ce83afe-a6ba-4214-ab26-117885f7ad15"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ecbacad-bd92-4a9e-8198-29c31cbd3ec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/332a1505-6cfe-4d91-a72d-7ad516114ef4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ce83afe-a6ba-4214-ab26-117885f7ad15"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=332a1505-6cfe-4d91-a72d-7ad516114ef4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bce1f499-4fe1-4e7b-8b8a-92730875524c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec701474-14d2-43d6-a49c-bb2999050ca9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5530bf0-198a-4efa-a3bf-16aea04b40b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9717fc5-7007-41c0-a050-7103a841cb2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec701474-14d2-43d6-a49c-bb2999050ca9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d5c0acc-b65c-4a68-927d-5e35241b331a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d5c0acc-b65c-4a68-927d-5e35241b331a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5530bf0-198a-4efa-a3bf-16aea04b40b6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f9717fc5-7007-41c0-a050-7103a841cb2d"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 624, 209, 33.493589743589745, 292.1602564102561, 116, 1781, 132.0, 669.5, 1028.75, 1436.25, 2.4605484183878676, 2.572174485019834, 1.1833795548733843], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 700.4137931034484, 498, 911, 761.5, 899.0, 907.15, 911.0, 0.24999353464996596, 1.6084620723709733, 0.4196668809211831], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 158.625, 123, 379, 127.0, 376.2, 379.0, 379.0, 0.10115442487387308, 0.05028086158281386, 0.05077477967301832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 196.33333333333331, 123, 391, 131.0, 385.0, 391.0, 391.0, 0.1101491419381843, 0.08551617953208644, 0.03915457779833895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e82d656-ac8b-485d-b996-172601dbadee", 3, 0, 0.0, 332.3333333333333, 209, 411, 377.0, 411.0, 411.0, 411.0, 0.026903658000699496, 0.02698247731124842, 0.01725267130904232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e24b5f6-c201-4402-9d2f-c427f81d2c6e", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, 100.0, 142.64285714285714, 118, 380, 125.0, 254.0, 380.0, 380.0, 0.11729615603740072, 0.05830443693655954, 0.05887717207346091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31cc434f-8042-4c2b-b3b4-35cf24c275e1", 3, 0, 0.0, 412.33333333333337, 237, 719, 281.0, 719.0, 719.0, 719.0, 0.09044317154054869, 0.040923179831172746, 0.05799903904130238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5228e5fd-3d67-4186-ada0-a429e6c42c10", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51366c62-a3c6-4d60-8841-2b5807892261", 3, 0, 0.0, 689.3333333333334, 300, 1097, 671.0, 1097.0, 1097.0, 1097.0, 0.06466910972192283, 0.02926108805777107, 0.041470750700582024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 124.33333333333333, 118, 130, 125.0, 130.0, 130.0, 130.0, 0.06317252416349049, 0.018630959274779424, 0.0390509841752827], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 230.17241379310346, 121, 513, 128.0, 506.2, 510.15, 513.0, 0.25152759648034834, 0.12502690098486063, 0.12158804712673088], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 542.8823529411766, 127, 1175, 476.0, 920.5999999999998, 1175.0, 1175.0, 0.07943034426045678, 0.015951774100100923, 0.053317071041098195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 542.8823529411766, 127, 1175, 476.0, 920.5999999999998, 1175.0, 1175.0, 0.08115178247503389, 0.016297485726833552, 0.054472574576101274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 827.1153846153848, 209, 1781, 866.5, 1281.6000000000001, 1626.2999999999993, 1781.0, 0.10897583670390007, 0.03415318439968984, 0.049166832575392415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 216.55555555555557, 123, 393, 131.0, 393.0, 393.0, 393.0, 0.042066886349295375, 0.03311124062258992, 0.014953463506976093], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 466.24999999999994, 116, 719, 493.5, 685.4000000000001, 719.0, 719.0, 0.08770102719828106, 0.021047390072243724, 0.05829784467874018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1196.5600000000002, 870, 1702, 1185.0, 1572.4, 1667.8, 1702.0, 0.10553065032207955, 0.054620356123732575, 0.04853997685712839], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 327.1764705882353, 117, 1097, 237.0, 1053.0, 1097.0, 1097.0, 0.08015843078083743, 0.14497864160929838, 0.05061934912533006], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 125.55555555555556, 123, 128, 126.0, 128.0, 128.0, 128.0, 0.04102040537276154, 0.020390025717515258, 0.020590320665624447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31cc434f-8042-4c2b-b3b4-35cf24c275e1", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51366c62-a3c6-4d60-8841-2b5807892261", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/033348a4-6a04-4a3d-97f5-4ccc29c8470f", 3, 0, 0.0, 337.0, 284, 432, 295.0, 432.0, 432.0, 432.0, 0.06886736146182454, 0.031160687640604198, 0.04416298895826638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77152634-9582-47e7-8b94-af19cac4ce1b", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}, {"data": ["addBook", 56, 56, 100.0, 748.3750000000001, 482, 1241, 729.0, 987.2, 1006.8999999999999, 1241.0, 0.2609396623627155, 0.8940496146480343, 0.5092245883793317], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e82d656-ac8b-485d-b996-172601dbadee", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82d0d64c-fae6-4920-a302-acb47916475c", 3, 0, 0.0, 390.6666666666667, 220, 623, 329.0, 623.0, 623.0, 623.0, 0.048883022926137755, 0.04027439161004383, 0.031347511446774536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1c69026-c45a-4d71-b0da-d585b4705446", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 163.64285714285717, 119, 379, 129.0, 377.5, 379.0, 379.0, 0.11023795650325202, 0.08235550461424589, 0.039186148600765365], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 477.1764705882353, 118, 1045, 429.0, 942.5999999999999, 1045.0, 1045.0, 0.08124214460145948, 0.016315632900201195, 0.05499058994939092], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5228e5fd-3d67-4186-ada0-a429e6c42c10", 2, 0, 0.0, 219.5, 211, 228, 219.5, 228.0, 228.0, 228.0, 0.021867961249972666, 0.02487907700802554, 0.013592731773054298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, 5.294117647058823, 194.6882352941177, 120, 853, 132.0, 364.40000000000003, 429.5999999999997, 685.4399999999981, 0.7362239506643339, 1.6871488726029416, 0.35020965465683307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 194.22222222222223, 122, 467, 129.0, 467.0, 467.0, 467.0, 0.04426585086343001, 0.03428009739716797, 0.015735126674109888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 126.9, 123, 132, 127.0, 131.6, 132.0, 132.0, 0.05311238580837051, 0.026400590211387295, 0.02665992803271723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 152.9047619047619, 122, 381, 129.0, 326.60000000000014, 380.3, 381.0, 0.11783784390413611, 0.09562817215267296, 0.04188767107529838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 454.2, 145, 1022, 384.0, 868.8000000000001, 977.3, 1022.0, 0.1040548077483372, 0.06391647858760166, 0.04704821873777356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ecbacad-bd92-4a9e-8198-29c31cbd3ec9", 3, 0, 0.0, 378.6666666666667, 258, 593, 285.0, 593.0, 593.0, 593.0, 0.023746764503336418, 0.02381633510246729, 0.015228231143090087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=033348a4-6a04-4a3d-97f5-4ccc29c8470f", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["login", 25, 8, 32.0, 1916.28, 1286, 2671, 1962.0, 2494.6, 2626.0, 2671.0, 0.10736894546516522, 0.16191740268078783, 0.16078918993351715], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bce1f499-4fe1-4e7b-8b8a-92730875524c", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.25809151785714285, 0.9849330357142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 155.55555555555554, 118, 380, 128.0, 380.0, 380.0, 380.0, 0.04184372762522898, 0.02079927476683745, 0.021003589843132515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82d0d64c-fae6-4920-a302-acb47916475c", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 207.37500000000003, 127, 383, 133.0, 373.2, 383.0, 383.0, 0.09463088042205373, 0.07661035143543217, 0.03363832077502691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ce83afe-a6ba-4214-ab26-117885f7ad15", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 126.73333333333332, 120, 135, 127.0, 131.4, 135.0, 135.0, 0.10488410306611194, 0.05213477388735448, 0.05264690329685698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ecbacad-bd92-4a9e-8198-29c31cbd3ec9", 1, 0, 0.0, 917.0, 917, 917, 917.0, 917.0, 917.0, 917.0, 1.0905125408942202, 0.19701642584514723, 0.7518572791712105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/332a1505-6cfe-4d91-a72d-7ad516114ef4", 3, 0, 0.0, 319.6666666666667, 271, 405, 283.0, 405.0, 405.0, 405.0, 0.01623253649615289, 0.02237786199909098, 0.010409536750462628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce83afe-a6ba-4214-ab26-117885f7ad15", 3, 0, 0.0, 390.66666666666663, 223, 668, 281.0, 668.0, 668.0, 668.0, 0.05104732086644319, 0.032818508695060325, 0.03273542386292093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=332a1505-6cfe-4d91-a72d-7ad516114ef4", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bce1f499-4fe1-4e7b-8b8a-92730875524c", 3, 0, 0.0, 580.3333333333334, 248, 942, 551.0, 942.0, 942.0, 942.0, 0.015928470548257957, 0.021958682542927228, 0.010214546542990942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 155.10000000000002, 126, 363, 131.0, 341.4000000000001, 363.0, 363.0, 0.056190508299338075, 0.04658763822865041, 0.01997396974703033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec701474-14d2-43d6-a49c-bb2999050ca9", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 138.5, 118, 378, 127.0, 133.5, 365.79999999999984, 378.0, 0.08937868407763433, 0.04442749042530847, 0.04486390978115629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5530bf0-198a-4efa-a3bf-16aea04b40b6", 3, 0, 0.0, 346.3333333333333, 224, 572, 243.0, 572.0, 572.0, 572.0, 0.020943139376592552, 0.028871808352822086, 0.013430333519494572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9717fc5-7007-41c0-a050-7103a841cb2d", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 146.95, 118, 472, 130.0, 147.90000000000003, 455.8499999999998, 472.0, 0.08779284400528513, 0.06815948338300945, 0.0312076125175037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec701474-14d2-43d6-a49c-bb2999050ca9", 3, 0, 0.0, 319.3333333333333, 217, 436, 305.0, 436.0, 436.0, 436.0, 0.02903909630332304, 0.029124171780774182, 0.01862207673097213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d5c0acc-b65c-4a68-927d-5e35241b331a", 3, 0, 0.0, 308.0, 240, 430, 254.0, 430.0, 430.0, 430.0, 0.12912667326647442, 0.05993966018163818, 0.0828058419059097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, 100.0, 149.0, 121, 378, 127.0, 324.8000000000002, 377.6, 378.0, 0.11883743039521934, 0.05907055866324868, 0.059650819553850334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, 100.0, 124.57142857142857, 116, 146, 123.0, 137.5, 146.0, 146.0, 0.09604763962925611, 0.04774243024540172, 0.05463647469144696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d5c0acc-b65c-4a68-927d-5e35241b331a", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5530bf0-198a-4efa-a3bf-16aea04b40b6", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 0.17288427033492823, 0.6597637559808613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9717fc5-7007-41c0-a050-7103a841cb2d", 3, 0, 0.0, 651.6666666666666, 355, 1042, 558.0, 1042.0, 1042.0, 1042.0, 0.03382072759658636, 0.028194949015253146, 0.0216884223194255], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 827.1153846153848, 209, 1781, 866.5, 1281.6000000000001, 1626.2999999999993, 1781.0, 0.10950411482769949, 0.03431874752562818, 0.04940517680702848], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.827751196172249, 1.2820512820512822], "isController": false}, {"data": ["401/Unauthorized", 15, 7.177033492822966, 2.4038461538461537], "isController": false}, {"data": ["404/Not Found", 186, 88.99521531100478, 29.807692307692307], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 624, 209, "404/Not Found", 186, "401/Unauthorized", 15, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
