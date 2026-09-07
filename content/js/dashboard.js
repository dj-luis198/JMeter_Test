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

    var data = {"OkPercent": 96.83496608892239, "KoPercent": 3.165033911077619};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7496786632390745, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7ec43810-f50c-4543-ae8a-a2d7481118c5"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e26c571-bfb5-4562-95c7-a23797731032"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c2ef93e-8100-4f9a-aad1-1a3cf1468870"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95c17645-412d-4edc-b17b-8ccf118c34c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d097fa7a-9a24-4854-8023-569267a1ad47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8140e14f-d808-4bcd-b3cc-e45093bf616a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18ffb947-a102-4fca-9de8-fe84f28cddaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=726b2e85-5ae3-427b-8320-31e206b36ef9"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.66, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90f7b3fd-7f50-4a54-a114-263db7f164a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36bc4585-c962-4447-bb17-2e9c4ce68e6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72d277a2-e817-4755-bb7e-3bc1c8a38b1d"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b4c4e4a-d523-40cb-8755-a15f36c5b452"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45b46446-e6a1-4975-9f44-6dd18a3efc5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b1029a2-301f-4103-955f-c848c4c0ec41"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95c17645-412d-4edc-b17b-8ccf118c34c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e26c571-bfb5-4562-95c7-a23797731032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18ffb947-a102-4fca-9de8-fe84f28cddaa"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/90f7b3fd-7f50-4a54-a114-263db7f164a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c2ef93e-8100-4f9a-aad1-1a3cf1468870"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8140e14f-d808-4bcd-b3cc-e45093bf616a"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68e47549-00ba-408b-9d3f-b648206e9875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9131736526946108, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/726b2e85-5ae3-427b-8320-31e206b36ef9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b1029a2-301f-4103-955f-c848c4c0ec41"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d097fa7a-9a24-4854-8023-569267a1ad47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b4c4e4a-d523-40cb-8755-a15f36c5b452"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45b46446-e6a1-4975-9f44-6dd18a3efc5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaa343bc-a5b2-4425-887c-4c4de88e2b53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 42, 3.165033911077619, 377.94875659382126, 90, 3534, 114.0, 1042.4, 1262.1999999999985, 1883.5200000000011, 5.3071933066173935, 788.1255486666026, 3.872169242775098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1666.7719298245615, 1154, 2366, 1717.0, 2009.4, 2052.0999999999995, 2366.0, 0.26292846961792343, 316.3925963508873, 1.2928172309826607], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7ec43810-f50c-4543-ae8a-a2d7481118c5", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.5946665502793296, 1.1111353584729982], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 503.1764705882354, 96, 1399, 507.0, 1022.9999999999997, 1399.0, 1399.0, 0.08516778052763944, 0.018248840841457673, 0.056688825423584464], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 503.1764705882354, 96, 1399, 507.0, 1022.9999999999997, 1399.0, 1399.0, 0.08532123444769557, 0.01828172130571602, 0.05679096642609424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 132.88235294117646, 94, 301, 100.0, 291.4, 301.0, 301.0, 0.12254548600098038, 0.05444432380121681, 0.06867841000836193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 136.1764705882353, 96, 306, 103.0, 301.2, 306.0, 306.0, 0.12253488640295236, 0.0910635239771941, 0.061506769151481955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 239.8235294117647, 93, 818, 101.0, 795.6, 818.0, 818.0, 0.1225437192739645, 4.268193237028387, 0.07092302227051886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 243.8235294117647, 92, 1091, 98.0, 937.3999999999999, 1091.0, 1091.0, 0.12254813618702286, 13.001971470613677, 0.07080590267515373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e26c571-bfb5-4562-95c7-a23797731032", 3, 0, 0.0, 841.6666666666666, 291, 1741, 493.0, 1741.0, 1741.0, 1741.0, 0.024107035236449838, 0.028493699525894974, 0.015459264132749409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c2ef93e-8100-4f9a-aad1-1a3cf1468870", 3, 0, 0.0, 566.3333333333334, 282, 799, 618.0, 799.0, 799.0, 799.0, 0.021352161194582244, 0.025237531672372436, 0.013692629411890306], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 231.76470588235293, 92, 597, 222.0, 395.3999999999998, 597.0, 597.0, 0.08473351310129643, 0.12149290481435884, 0.054754554737849466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95c17645-412d-4edc-b17b-8ccf118c34c8", 3, 0, 0.0, 451.66666666666663, 271, 746, 338.0, 746.0, 746.0, 746.0, 0.02584758540473011, 0.02592331075259553, 0.01657543725498643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 109.14999999999998, 94, 286, 100.0, 105.0, 276.9499999999999, 286.0, 0.10369410239792612, 0.07706173039533376, 0.05204957874270901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d097fa7a-9a24-4854-8023-569267a1ad47", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 126.30000000000001, 93, 300, 97.0, 289.6, 299.5, 300.0, 0.10369464002405716, 0.03553364178168131, 0.05870291291205658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 722.6666666666666, 484, 817, 751.0, 817.0, 817.0, 817.0, 0.07242761262493763, 21.2961229348071, 0.04130637282515974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8140e14f-d808-4bcd-b3cc-e45093bf616a", 3, 0, 0.0, 296.6666666666667, 213, 444, 233.0, 444.0, 444.0, 444.0, 0.02505846976277982, 0.025131883248412965, 0.0160693962996993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 985.3333333333334, 672, 1193, 985.0, 1193.0, 1193.0, 1193.0, 0.07229380201137423, 65.05009012878337, 0.04115945954358513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 145.77777777777777, 94, 318, 100.0, 318.0, 318.0, 318.0, 0.0728066982162359, 0.12883372770294868, 0.040313865125591555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 99.38461538461539, 92, 103, 100.0, 103.0, 103.0, 103.0, 0.07141797645404253, 0.0530752735171156, 0.03584847646228307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18ffb947-a102-4fca-9de8-fe84f28cddaa", 3, 0, 0.0, 572.6666666666666, 237, 1039, 442.0, 1039.0, 1039.0, 1039.0, 0.020948111527745773, 0.02475995864493649, 0.013433522040904679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 144.46153846153845, 95, 299, 100.0, 298.2, 299.0, 299.0, 0.07141797645404253, 0.035612419448763095, 0.03980779637086806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 235.76923076923077, 94, 1074, 102.0, 998.4, 1074.0, 1074.0, 0.07141758410793944, 9.902698262767267, 0.04104150529039489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 232.76923076923075, 95, 803, 103.0, 695.8, 803.0, 803.0, 0.07141719176614715, 3.246907086233512, 0.041111023174878726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 122.0, 95, 288, 100.0, 288.0, 288.0, 288.0, 0.0728090542103858, 0.054109072513773046, 0.040883990401339686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 174.59999999999997, 91, 905, 100.0, 296.40000000000003, 874.5999999999996, 905.0, 0.10369302716238847, 4.691709491346817, 0.06051460257055014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 744.625, 96, 1326, 1018.5, 1274.2, 1326.0, 1326.0, 0.09260920651274245, 52.09056465931388, 0.049469956994599724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=726b2e85-5ae3-427b-8320-31e206b36ef9", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 168.65, 93, 716, 101.5, 298.8, 695.1499999999996, 716.0, 0.1036957152930441, 1.5510509398720393, 0.06061743669376581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 530.1875, 92, 884, 719.5, 829.4000000000001, 884.0, 884.0, 0.09261188673566252, 17.028716739309115, 0.049561830010881894], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 409.8125000000001, 99, 956, 453.0, 851.7, 956.0, 956.0, 0.08417995570029832, 0.018213985776218113, 0.05616278660644293], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 383.53846153846155, 196, 1167, 207.0, 1094.1999999999998, 1167.0, 1167.0, 0.07137719553508189, 13.230823770047383, 0.1577193664862105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 681.24, 138, 1722, 578.0, 1497.2000000000005, 1698.3, 1722.0, 0.10816844856157597, 0.06644331459495242, 0.048908195003915696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 112.4375, 93, 302, 100.5, 164.80000000000013, 302.0, 302.0, 0.09260759845345311, 0.06882263908503693, 0.04648467344245596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90f7b3fd-7f50-4a54-a114-263db7f164a4", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.2641287463450292, 1.0079724049707601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36bc4585-c962-4447-bb17-2e9c4ce68e6c", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.6570698302469136, 1.227735982510288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 149.0, 93, 306, 101.0, 305.3, 306.0, 306.0, 0.09260867048677433, 0.11171373068241014, 0.04795483156798055], "isController": false}, {"data": ["login", 25, 0, 0.0, 3315.84, 1843, 5539, 3104.0, 5158.400000000001, 5433.099999999999, 5539.0, 0.10559706693586879, 45.620189228623985, 0.22236019872312027], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 108.80000000000001, 98, 134, 106.5, 131.40000000000003, 133.95, 134.0, 0.10342010279958218, 0.08372584494223988, 0.03676261466703898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72d277a2-e817-4755-bb7e-3bc1c8a38b1d", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.6765591896186441, 1.2641518802966103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 872.0, 196, 1428, 1121.0, 1373.4, 1428.0, 1428.0, 0.09255402841408672, 69.25803710621153, 0.1933556692234717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b4c4e4a-d523-40cb-8755-a15f36c5b452", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 442.11764705882354, 197, 1205, 394.0, 1193.0, 1205.0, 1205.0, 0.12244574573060495, 17.401286276803013, 0.2716975999733501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 584.3157894736842, 90, 1388, 103.0, 1293.0, 1388.0, 1388.0, 0.1524977526646976, 86.44057955165661, 0.2160646098866701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45b46446-e6a1-4975-9f44-6dd18a3efc5b", 3, 0, 0.0, 387.3333333333333, 208, 634, 320.0, 634.0, 634.0, 634.0, 0.04827730483899519, 0.031037655291997233, 0.03095907894948585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b1029a2-301f-4103-955f-c848c4c0ec41", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1092.2307692307693, 140, 2147, 1203.0, 1866.3, 2058.7999999999997, 2147.0, 0.10341631829951752, 0.032131151779357305, 0.04665853423279013], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 309.09999999999997, 195, 1010, 206.5, 560.5000000000003, 988.3999999999996, 1010.0, 0.10363983085979603, 6.352053858057479, 0.2317625475447724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 126.04761904761905, 100, 334, 106.0, 249.0000000000001, 328.69999999999993, 334.0, 0.10817549155458484, 0.08398390213466304, 0.03845300676354383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 301.2307692307692, 195, 684, 206.0, 574.8, 684.0, 684.0, 0.07580793767421247, 0.11748749715720234, 0.1704938285778431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 149.85714285714286, 96, 440, 102.0, 440.0, 440.0, 440.0, 0.03674695000314974, 0.02730901264882515, 0.018445246388299773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95c17645-412d-4edc-b17b-8ccf118c34c8", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 128.42857142857144, 94, 302, 100.0, 302.0, 302.0, 302.0, 0.03674791455584896, 0.009832938074514271, 0.02095779502013261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 99.28571428571429, 94, 105, 100.0, 105.0, 105.0, 105.0, 0.03674791455584896, 0.009904711345131163, 0.021603754455684642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 129.0, 97, 298, 101.0, 298.0, 298.0, 298.0, 0.036747721641258245, 0.009904659348620386, 0.021639527489920624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 103.6, 99, 107, 104.0, 107.0, 107.0, 107.0, 0.059972892252701776, 0.017687317832339785, 0.03707308671480491], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1137.263157894737, 759, 1955, 1086.0, 1587.0, 1633.2999999999995, 1955.0, 0.25609690347393205, 306.38093024392106, 0.5056913465080962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1092.2307692307693, 140, 2147, 1203.0, 1866.3, 2058.7999999999997, 2147.0, 0.1057538213736608, 0.032857407241696286, 0.04771314987756961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 98.0, 91, 102, 99.0, 102.0, 102.0, 102.0, 0.02821431594390994, 0.007604639844256976, 0.016614484877126655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e26c571-bfb5-4562-95c7-a23797731032", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 134.2, 91, 282, 100.0, 282.0, 282.0, 282.0, 0.028214475154333177, 0.007604682756441365, 0.016587025432527904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 163.28571428571428, 94, 854, 101.0, 300.0, 798.6999999999991, 854.0, 0.10586118070503546, 4.563082590939795, 0.06180158401092891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 176.95238095238096, 91, 769, 101.0, 303.0, 722.4999999999993, 769.0, 0.10590709426235709, 1.510052742363342, 0.06193181316727773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 137.8, 100, 282, 103.0, 282.0, 282.0, 282.0, 0.02821431594390994, 0.007549533758429027, 0.016090977061761137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 119.80952380952381, 95, 308, 101.0, 251.60000000000014, 306.0, 308.0, 0.10626239727968263, 0.0789703948533579, 0.053338742384528195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 141.2, 98, 298, 103.0, 298.0, 298.0, 298.0, 0.028214793580570167, 0.020968220619935446, 0.014162503808997135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 150.57142857142856, 96, 417, 100.0, 298.4, 405.1999999999998, 417.0, 0.10615818580715608, 0.035998209212508465, 0.060118786586660464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 184.0, 98, 309, 109.0, 309.0, 309.0, 309.0, 0.029735355337496282, 0.02340497695509961, 0.010569989592625631], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 516.625, 90, 1540, 472.0, 1189.3000000000004, 1540.0, 1540.0, 0.08513128840884301, 0.01769238507276065, 0.05791982860677326], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1844.3600000000001, 1087, 3534, 1609.0, 2949.6000000000013, 3472.7999999999997, 3534.0, 0.10709940538410131, 0.05543230942731806, 0.04926154290616379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 280.0, 202, 581, 204.0, 581.0, 581.0, 581.0, 0.028198563001229457, 0.043702265120069486, 0.0634192290935854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18ffb947-a102-4fca-9de8-fe84f28cddaa", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90f7b3fd-7f50-4a54-a114-263db7f164a4", 3, 0, 0.0, 1493.0, 331, 2608, 1540.0, 2608.0, 2608.0, 2608.0, 0.0299344435685848, 0.03002214213372714, 0.01919624148115627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c2ef93e-8100-4f9a-aad1-1a3cf1468870", 1, 0, 0.0, 956.0, 956, 956, 956.0, 956.0, 956.0, 956.0, 1.0460251046025104, 0.188979144874477, 0.7211852771966527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8140e14f-d808-4bcd-b3cc-e45093bf616a", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["addBook", 55, 12, 21.818181818181817, 1063.4545454545455, 525, 2038, 876.0, 1798.4, 1902.5999999999997, 2038.0, 0.25919921580455435, 91.3238732492271, 0.9380277870395679], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/68e47549-00ba-408b-9d3f-b648206e9875", 2, 0, 0.0, 348.5, 207, 490, 348.5, 490.0, 490.0, 490.0, 0.06439772032070064, 0.03958824701355572, 0.04002846580481051], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 172.03508771929822, 93, 419, 104.0, 405.0, 413.4, 419.0, 0.25725156043380737, 0.19118011473645255, 0.1243550023581393], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 603.421052631579, 448, 902, 579.0, 804.0, 867.2999999999998, 902.0, 0.2570682493652218, 75.58660078259243, 0.1292872543194231], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 140.280701754386, 91, 418, 104.0, 299.6, 314.6999999999998, 418.0, 0.25766205587198265, 0.4559410598047193, 0.12530830451586655], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 963.7368421052629, 655, 1500, 938.0, 1208.6, 1289.7999999999997, 1500.0, 0.25662151028512, 230.90848604704954, 0.12881196902983563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 107.15384615384616, 101, 128, 105.0, 120.8, 128.0, 128.0, 0.07615833904520876, 0.05689563414998506, 0.02707190958247655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 12, 7.18562874251497, 171.72455089820355, 93, 1050, 107.0, 345.20000000000005, 436.19999999999993, 817.4399999999977, 0.683585755218993, 1.6287767345476871, 0.3239805055259926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 131.85714285714286, 102, 293, 104.0, 293.0, 293.0, 293.0, 0.036209393751293194, 0.028041063715601076, 0.012871307935030003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/726b2e85-5ae3-427b-8320-31e206b36ef9", 3, 0, 0.0, 326.6666666666667, 219, 416, 345.0, 416.0, 416.0, 416.0, 0.07147451933385748, 0.03234035868296286, 0.045834896838443766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 107.88235294117646, 94, 134, 105.0, 121.99999999999999, 134.0, 134.0, 0.12269141665283381, 0.09956696019385244, 0.04361296451331202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b1029a2-301f-4103-955f-c848c4c0ec41", 3, 0, 0.0, 512.6666666666666, 313, 628, 597.0, 628.0, 628.0, 628.0, 0.06648641460928151, 0.030083371193652765, 0.04263614478524888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 281.0, 198, 743, 205.0, 743.0, 743.0, 743.0, 0.036727284174737924, 0.05692011717315341, 0.08260052290470844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 327.1428571428571, 198, 951, 207.0, 591.4, 915.1999999999995, 951.0, 0.1058051774000141, 6.183777295216598, 0.236669216802366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d097fa7a-9a24-4854-8023-569267a1ad47", 3, 0, 0.0, 286.3333333333333, 190, 451, 218.0, 451.0, 451.0, 451.0, 0.0455788514129444, 0.02930280974627773, 0.02922862541780614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 106.46153846153845, 102, 114, 105.0, 113.2, 114.0, 114.0, 0.07169802995874607, 0.059444948666968166, 0.02548640908689801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b4c4e4a-d523-40cb-8755-a15f36c5b452", 3, 0, 0.0, 405.6666666666667, 222, 576, 419.0, 576.0, 576.0, 576.0, 0.06879787185249737, 0.03189068018162638, 0.04411842693666009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 120.5, 95, 288, 107.5, 183.7000000000001, 288.0, 288.0, 0.09133775560300043, 0.07091163643006382, 0.03246771781200406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45b46446-e6a1-4975-9f44-6dd18a3efc5b", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaa343bc-a5b2-4425-887c-4c4de88e2b53", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 123.0, 92, 374, 103.0, 267.5999999999999, 374.0, 374.0, 0.07585349772147763, 0.056371593521527805, 0.03807490022347607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 129.46153846153845, 91, 306, 100.0, 296.8, 306.0, 306.0, 0.07597407530784112, 0.02032900061948092, 0.043328964824003134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 157.15384615384613, 94, 308, 102.0, 298.8, 308.0, 308.0, 0.07597851561358496, 0.02047858428647407, 0.04466705703064272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 158.30769230769232, 96, 299, 102.0, 298.2, 299.0, 299.0, 0.07597762751091448, 0.020478344915051166, 0.04474073182527483], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.80952380952381, 0.7535795026375283], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.904761904761905, 0.37678975131876413], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.904761904761905, 0.37678975131876413], "isController": false}, {"data": ["401/Unauthorized", 22, 52.38095238095238, 1.6578749058025621], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 42, "401/Unauthorized", 22, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
