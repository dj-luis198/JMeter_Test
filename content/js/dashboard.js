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

    var data = {"OkPercent": 98.5634477254589, "KoPercent": 1.4365522745411015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7656142759094029, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e03944ae-eca0-4faa-96ef-6020691e1bba"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4c98383-bb2b-41cb-b485-9b39bacd3451"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb9b4adb-15c3-4213-9b20-2b766dbf83bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b378395-6193-4af4-b337-d8e19610b096"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3bc2ba8-6ab1-4eea-b656-6959daf87823"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42393c18-17a1-427e-a443-733050d6551c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f613791f-cfc9-4cc7-9ca2-1e83e8bbe640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95da4f8c-d09b-44b4-b0be-b6ab92e753a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e5b7549-784d-478a-974e-38b06321a27c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95fc1692-00b9-4d46-a2d5-ff57663fc903"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b619c6a7-0941-4955-a975-bdfdb4a9b215"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67b1f24c-669a-4e32-81c3-68112083ea10"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42c0a90e-651d-4433-9aaa-cb7399e750fc"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb9b4adb-15c3-4213-9b20-2b766dbf83bd"], "isController": false}, {"data": [0.3627450980392157, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4c98383-bb2b-41cb-b485-9b39bacd3451"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3a9cda64-4f56-4c01-9fad-6c694de7d6c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95fc1692-00b9-4d46-a2d5-ff57663fc903"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3bc2ba8-6ab1-4eea-b656-6959daf87823"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/805a679b-bc23-4592-86c4-c449ba4b6cdc"], "isController": false}, {"data": [0.9019607843137255, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9901960784313726, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42393c18-17a1-427e-a443-733050d6551c"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f613791f-cfc9-4cc7-9ca2-1e83e8bbe640"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b619c6a7-0941-4955-a975-bdfdb4a9b215"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67b1f24c-669a-4e32-81c3-68112083ea10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a9cda64-4f56-4c01-9fad-6c694de7d6c9"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e03944ae-eca0-4faa-96ef-6020691e1bba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e5b7549-784d-478a-974e-38b06321a27c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42c0a90e-651d-4433-9aaa-cb7399e750fc"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1253, 18, 1.4365522745411015, 411.73982442138856, 127, 4166, 154.0, 1052.0, 1224.3, 1788.1800000000012, 4.875884799925285, 645.6161969946961, 3.565052220949961], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 1980.6078431372553, 1600, 2423, 1946.0, 2298.8, 2351.6, 2423.0, 0.22990682011819916, 276.6558917214949, 1.130450038374153], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 441.7692307692307, 143, 583, 449.0, 555.8, 583.0, 583.0, 0.08592598467873595, 0.016278946316088647, 0.05808653366315692], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 441.7692307692307, 143, 583, 449.0, 555.8, 583.0, 583.0, 0.08821812950421412, 0.016713200316228066, 0.05963603871757984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 261.2, 133, 417, 139.0, 415.8, 417.0, 417.0, 0.07938061948635447, 0.029188915290294926, 0.04482731076983325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 136.93333333333337, 129, 144, 136.0, 142.8, 144.0, 144.0, 0.0794912559618442, 0.05907504471383148, 0.03990088434022258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 248.06666666666663, 127, 918, 135.0, 683.4000000000001, 918.0, 918.0, 0.0794942048724648, 1.5782601401482832, 0.046356093297048644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e03944ae-eca0-4faa-96ef-6020691e1bba", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 237.53333333333333, 132, 1109, 136.0, 693.8000000000002, 1109.0, 1109.0, 0.07949462616327137, 4.7886248241181395, 0.04627870749687321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4c98383-bb2b-41cb-b485-9b39bacd3451", 3, 0, 0.0, 489.0, 237, 752, 478.0, 752.0, 752.0, 752.0, 0.015846521160387924, 0.021845708696042593, 0.01016199436392064], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 257.6923076923077, 141, 394, 246.0, 380.8, 394.0, 394.0, 0.08588511214613682, 0.2058158775971988, 0.05551693134145938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb9b4adb-15c3-4213-9b20-2b766dbf83bd", 3, 0, 0.0, 293.6666666666667, 214, 451, 216.0, 451.0, 451.0, 451.0, 0.025021894157387717, 0.025095200487926937, 0.01604594124025189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b378395-6193-4af4-b337-d8e19610b096", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 137.35000000000002, 130, 142, 137.5, 142.0, 142.0, 142.0, 0.09457874626413953, 0.07028752529981462, 0.04747409724586691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 162.45000000000002, 129, 398, 136.5, 370.50000000000057, 397.9, 398.0, 0.09457472112279108, 0.025306126550434332, 0.05393714564034179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 728.75, 655, 921, 669.5, 921.0, 921.0, 921.0, 0.0536783059126654, 15.783204225824633, 0.030613408840816984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1065.0, 916, 1224, 1060.0, 1224.0, 1224.0, 1224.0, 0.053468787595241284, 48.111309066301295, 0.030441702312525062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 279.25, 132, 420, 282.5, 420.0, 420.0, 420.0, 0.05384957122278914, 0.09528849907782609, 0.029817096565743592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 138.41176470588235, 132, 150, 138.0, 146.8, 150.0, 150.0, 0.09364172675344133, 0.0695911660736024, 0.04700375737428598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 183.7058823529412, 131, 406, 136.0, 398.0, 406.0, 406.0, 0.09364430587535393, 0.033330659421168016, 0.05294389122387599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 247.52941176470588, 132, 1193, 138.0, 572.1999999999995, 1193.0, 1193.0, 0.09319102515609497, 4.9561961496346365, 0.054315035686680814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 237.82352941176467, 132, 1046, 138.0, 541.1999999999996, 1046.0, 1046.0, 0.09326618168252192, 1.6367979148150587, 0.054449919832230596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 135.5, 133, 138, 135.5, 138.0, 138.0, 138.0, 0.05405697605275961, 0.04017320192983405, 0.03035425901400076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 967.3333333333333, 128, 3027, 965.0, 2059.2000000000007, 3027.0, 3027.0, 0.08172649954505581, 49.032441248862646, 0.043363995526836265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 175.45000000000002, 129, 411, 136.5, 406.40000000000003, 410.85, 411.0, 0.0945796407865243, 0.025492168805742878, 0.05560248413426526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 707.8666666666667, 133, 1102, 939.0, 1024.0, 1102.0, 1102.0, 0.08184109732543295, 16.050019573662443, 0.04350472393633854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 162.85000000000002, 129, 409, 136.0, 375.90000000000055, 408.65, 409.0, 0.09457874626413953, 0.025491927704006354, 0.05569432030983997], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 568.7692307692307, 142, 956, 563.0, 952.4, 956.0, 956.0, 0.08791030444014661, 0.016654881895887153, 0.06012795387075833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3bc2ba8-6ab1-4eea-b656-6959daf87823", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 418.8235294117647, 266, 1325, 289.0, 704.9999999999994, 1325.0, 1325.0, 0.09312058019599143, 6.689040426656588, 0.20802885128917228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 534.6315789473684, 210, 984, 549.0, 901.0, 984.0, 984.0, 0.07850980132888169, 0.04822525882408846, 0.035498083999289276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 174.4, 132, 416, 138.0, 413.0, 416.0, 416.0, 0.08183886473126846, 0.06081970318407743, 0.04107927389831248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 207.33333333333331, 133, 411, 138.0, 410.4, 411.0, 411.0, 0.08172649954505581, 0.1037011377690845, 0.04203381161497012], "isController": false}, {"data": ["login", 19, 0, 0.0, 2795.4736842105267, 1542, 5821, 2621.0, 4067.0, 5821.0, 5821.0, 0.07734329840672804, 19.586927952173347, 0.14369491198129106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42393c18-17a1-427e-a443-733050d6551c", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 147.55000000000004, 137, 226, 141.5, 163.20000000000002, 222.89999999999995, 226.0, 0.09699838497689013, 0.07852701283773625, 0.034479894659753915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f613791f-cfc9-4cc7-9ca2-1e83e8bbe640", 3, 0, 0.0, 330.6666666666667, 246, 481, 265.0, 481.0, 481.0, 481.0, 0.017800351260264868, 0.024539221219798738, 0.011414938796458917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95da4f8c-d09b-44b4-b0be-b6ab92e753a9", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e5b7549-784d-478a-974e-38b06321a27c", 3, 0, 0.0, 549.0, 279, 945, 423.0, 945.0, 945.0, 945.0, 0.02346004363568116, 0.023528774232270074, 0.015044363920016892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95fc1692-00b9-4d46-a2d5-ff57663fc903", 3, 0, 0.0, 317.6666666666667, 214, 397, 342.0, 397.0, 397.0, 397.0, 0.07913479293062517, 0.03580643299920865, 0.05074724676866263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b619c6a7-0941-4955-a975-bdfdb4a9b215", 2, 0, 0.0, 314.0, 234, 394, 314.0, 394.0, 394.0, 394.0, 0.011746878267100518, 0.02322991063562358, 0.007301648454110819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67b1f24c-669a-4e32-81c3-68112083ea10", 3, 0, 0.0, 377.3333333333333, 250, 452, 430.0, 452.0, 452.0, 452.0, 0.017029586067527986, 0.02347665917837924, 0.010920665544606164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1144.3999999999999, 270, 3170, 1109.0, 2196.2000000000007, 3170.0, 3170.0, 0.08166331847060937, 65.17400050052808, 0.1697331668082164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42c0a90e-651d-4433-9aaa-cb7399e750fc", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 492.2, 273, 1254, 531.0, 902.4000000000002, 1254.0, 1254.0, 0.0793214315931974, 6.441137796529952, 0.17704274995505118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 849.5, 141, 1357, 1070.5, 1357.0, 1357.0, 1357.0, 0.07238508867173361, 57.73827700868621, 0.1248006582519001], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1165.2857142857142, 268, 2998, 1041.0, 2213.0000000000005, 2929.099999999999, 2998.0, 0.08678905300744733, 0.027266873238388865, 0.0391567797748444], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 356.00000000000006, 267, 551, 281.0, 546.6, 550.8, 551.0, 0.09451572505375581, 0.14648091373077196, 0.2125680808582028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 159.2857142857143, 135, 418, 139.5, 282.5, 418.0, 418.0, 0.097334427186896, 0.07556725548201398, 0.03459934716409194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 469.82352941176464, 269, 1330, 280.0, 911.5999999999997, 1330.0, 1330.0, 0.08824842450606837, 6.339063586883169, 0.19714458758137024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 219.9, 132, 421, 138.5, 420.5, 421.0, 421.0, 0.05921399345093232, 0.04400571192984326, 0.029722649056425018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 267.90000000000003, 134, 416, 265.0, 414.3, 416.0, 416.0, 0.05911632911242744, 0.01581823650078625, 0.033714781446931276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 241.8, 133, 415, 138.5, 413.9, 415.0, 415.0, 0.05921329219983302, 0.015959832663236244, 0.03481093935966746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 246.1, 132, 431, 141.0, 430.0, 431.0, 431.0, 0.05912401854129221, 0.015935770622457667, 0.0348161945121086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb9b4adb-15c3-4213-9b20-2b766dbf83bd", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1270.0980392156862, 1040, 1860, 1103.0, 1743.8000000000002, 1779.6, 1860.0, 0.2352431076075776, 281.432540435292, 0.46451324568605656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1165.2857142857142, 268, 2998, 1041.0, 2213.0000000000005, 2929.099999999999, 2998.0, 0.08462691619517385, 0.026587585835872143, 0.03818128445524445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 149.0, 133, 200, 138.0, 200.0, 200.0, 200.0, 0.03598261320130113, 0.009698438714413195, 0.02118898023475057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 195.2, 133, 400, 135.0, 400.0, 400.0, 400.0, 0.03598934715324264, 0.00970025372489743, 0.021157799791261787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4c98383-bb2b-41cb-b485-9b39bacd3451", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 277.92857142857144, 131, 1083, 136.0, 744.0, 1083.0, 1083.0, 0.09658103148541626, 6.231585198698226, 0.056186230649300485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 277.5714285714286, 131, 1049, 136.5, 732.5, 1049.0, 1049.0, 0.09657903269200258, 2.052560443815148, 0.05627938330838375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 202.0, 132, 399, 139.0, 399.0, 399.0, 399.0, 0.03598157743235464, 0.009627883023891767, 0.02052074337938975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 160.0, 132, 461, 136.5, 305.0, 461.0, 461.0, 0.09657770020902173, 0.07177307603424368, 0.04847747842523161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 193.2, 135, 415, 138.0, 415.0, 415.0, 415.0, 0.035999193618062954, 0.02675330697592374, 0.01806990773406676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 191.78571428571428, 131, 414, 133.5, 409.5, 414.0, 414.0, 0.09658103148541626, 0.036204412890808245, 0.05450199112144375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 194.8, 137, 417, 139.0, 417.0, 417.0, 417.0, 0.03797429899444056, 0.029889926747577237, 0.013498676595680043], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 516.9166666666666, 152, 1409, 453.5, 1156.7000000000007, 1409.0, 1409.0, 0.08298296083204248, 0.015593071009211108, 0.05647676606757579], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1566.6315789473683, 776, 4166, 1163.0, 2539.0, 4166.0, 4166.0, 0.07882084023015686, 0.040795942697249156, 0.03625450756680066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 398.0, 276, 816, 281.0, 816.0, 816.0, 816.0, 0.035946396733191464, 0.05570989415583482, 0.08084428874662104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a9cda64-4f56-4c01-9fad-6c694de7d6c9", 3, 0, 0.0, 1155.6666666666667, 235, 2801, 431.0, 2801.0, 2801.0, 2801.0, 0.026894010703816258, 0.026972801750800097, 0.017246484728684255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95fc1692-00b9-4d46-a2d5-ff57663fc903", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3bc2ba8-6ab1-4eea-b656-6959daf87823", 3, 0, 0.0, 356.6666666666667, 222, 568, 280.0, 568.0, 568.0, 568.0, 0.05034317262673894, 0.03236580922454733, 0.032283870467016834], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 1282.0322580645159, 698, 3788, 1095.0, 2032.2, 2183.4499999999994, 3788.0, 0.2843358464953314, 77.87806922202044, 1.0367724785830903], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/805a679b-bc23-4592-86c4-c449ba4b6cdc", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.6261488970588235, 1.1699601715686274], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 243.7843137254903, 133, 567, 140.0, 537.8, 554.6, 567.0, 0.2362489229828511, 0.17557170936518526, 0.11420236023096807], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 766.9019607843137, 633, 1090, 678.0, 1050.6000000000001, 1082.8, 1090.0, 0.23617890320369736, 69.44443941953246, 0.11878138198232827], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 223.88235294117646, 131, 543, 141.0, 408.8, 409.0, 543.0, 0.23672374339146218, 0.41889006154817326, 0.11512541426655093], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1012.6470588235295, 901, 1309, 950.0, 1237.8, 1281.8, 1309.0, 0.23586759965406084, 212.23408077973897, 0.11839447873260475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 167.64705882352942, 135, 416, 145.0, 291.9999999999999, 416.0, 416.0, 0.08663038382355939, 0.06471898791506146, 0.03079439424978088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42393c18-17a1-427e-a443-733050d6551c", 3, 0, 0.0, 405.6666666666667, 258, 504, 455.0, 504.0, 504.0, 504.0, 0.03162155325069567, 0.02636158784994519, 0.020278144499957837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, 4.571428571428571, 208.9771428571429, 132, 1511, 143.0, 347.80000000000007, 423.5999999999999, 1413.7200000000012, 0.7477514047044246, 1.480063745807251, 0.3649293909030701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 142.8, 137, 148, 141.5, 147.9, 148.0, 148.0, 0.058751299872509676, 0.04549783281142595, 0.020884251126556175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 140.86666666666665, 136, 148, 141.0, 146.2, 148.0, 148.0, 0.0761467703616464, 0.0617948888384064, 0.027067797276991493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f613791f-cfc9-4cc7-9ca2-1e83e8bbe640", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b619c6a7-0941-4955-a975-bdfdb4a9b215", 1, 0, 0.0, 956.0, 956, 956, 956.0, 956.0, 956.0, 956.0, 1.0460251046025104, 0.188979144874477, 0.7211852771966527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 549.6999999999999, 274, 847, 553.5, 846.0, 847.0, 847.0, 0.05906814100746621, 0.09154408181528212, 0.13284563353534637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67b1f24c-669a-4e32-81c3-68112083ea10", 1, 0, 0.0, 947.0, 947, 947, 947.0, 947.0, 947.0, 947.0, 1.0559662090813093, 0.19077514519535377, 0.7280392027455121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a9cda64-4f56-4c01-9fad-6c694de7d6c9", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 518.4285714285714, 267, 1221, 537.0, 1049.0, 1221.0, 1221.0, 0.09648651256392232, 8.383955100604418, 0.21523707253028984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e03944ae-eca0-4faa-96ef-6020691e1bba", 3, 0, 0.0, 397.3333333333333, 325, 506, 361.0, 506.0, 506.0, 506.0, 0.030233706551644212, 0.025204597161054953, 0.019388151662349966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e5b7549-784d-478a-974e-38b06321a27c", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 172.94117647058826, 135, 405, 143.0, 399.4, 405.0, 405.0, 0.09459263957978611, 0.07842690527660001, 0.0336247273506271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 142.9333333333333, 136, 167, 140.0, 157.4, 167.0, 167.0, 0.07934031175453166, 0.06159721469223893, 0.028203001443993674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 152.29411764705878, 132, 394, 138.0, 193.19999999999982, 394.0, 394.0, 0.08831168831168831, 0.06563007305194805, 0.04432832792207792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 196.7058823529412, 130, 403, 136.0, 399.8, 403.0, 403.0, 0.08831168831168831, 0.03143262987012987, 0.04992897727272727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 282.88235294117646, 132, 1190, 137.0, 664.3999999999995, 1190.0, 1190.0, 0.08831214707608871, 4.69672184173684, 0.05147145244910363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 247.0, 131, 682, 138.0, 466.79999999999984, 682.0, 682.0, 0.08831122955205427, 1.549839757325936, 0.051557159118653925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42c0a90e-651d-4433-9aaa-cb7399e750fc", 3, 0, 0.0, 646.3333333333333, 233, 1409, 297.0, 1409.0, 1409.0, 1409.0, 0.027398010904408337, 0.027656650981305424, 0.01756968798231915], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4788507581803671], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07980845969672785], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07980845969672785], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7980845969672785], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1253, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
